import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private auditService: AuditService,
  ) {}

  async getUpcomingEvents(category?: string): Promise<Event[]> {
    const now = new Date();
    const query = this.eventRepo
      .createQueryBuilder('event')
      .where('event.isPublished = :isPublished', { isPublished: true })
      .andWhere('event.endTime >= :now', { now })
      .orderBy('event.startTime', 'ASC');

    if (category) {
      query.andWhere('event.category = :category', { category });
    }

    return query.getMany();
  }

  async getPastEvents(limit = 10): Promise<Event[]> {
    const now = new Date();
    return this.eventRepo
      .createQueryBuilder('event')
      .where('event.isPublished = :isPublished', { isPublished: true })
      .andWhere('event.endTime < :now', { now })
      .orderBy('event.startTime', 'DESC')
      .take(limit)
      .getMany();
  }

  async getEventBySlug(slug: string): Promise<Event> {
    const event = await this.eventRepo.findOne({
      where: { slug, isPublished: true },
    });
    if (!event) {
      throw new NotFoundException(`Event with slug "${slug}" not found`);
    }
    return event;
  }

  async getAllEventsAdmin(): Promise<Event[]> {
    return this.eventRepo.find({
      order: { startTime: 'DESC' },
    });
  }

  async createEvent(
    dto: CreateEventDto,
    adminId?: string,
    adminEmail?: string,
  ): Promise<Event> {
    const existing = await this.eventRepo.findOne({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException(`An event with slug "${dto.slug}" already exists`);
    }

    const event = this.eventRepo.create({
      ...dto,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
    });
    const saved = await this.eventRepo.save(event);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'CREATE_EVENT',
      entityType: 'EVENT',
      entityId: saved.id,
      details: { title: saved.title, slug: saved.slug },
    });

    return saved;
  }

  async updateEvent(
    id: string,
    dto: Partial<CreateEventDto>,
    adminId?: string,
    adminEmail?: string,
  ): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (dto.slug && dto.slug !== event.slug) {
      const existing = await this.eventRepo.findOne({ where: { slug: dto.slug } });
      if (existing) {
        throw new ConflictException(`An event with slug "${dto.slug}" already exists`);
      }
    }

    const updatePayload: any = { ...dto };
    if (dto.startTime) updatePayload.startTime = new Date(dto.startTime);
    if (dto.endTime) updatePayload.endTime = new Date(dto.endTime);

    Object.assign(event, updatePayload);
    const updated = await this.eventRepo.save(event);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPDATE_EVENT',
      entityType: 'EVENT',
      entityId: id,
      details: { title: updated.title, changes: dto },
    });

    return updated;
  }

  async deleteEvent(
    id: string,
    adminId?: string,
    adminEmail?: string,
  ): Promise<{ message: string }> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    await this.eventRepo.remove(event);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'DELETE_EVENT',
      entityType: 'EVENT',
      entityId: id,
      details: { title: event.title },
    });

    return { message: 'Event deleted successfully' };
  }
}
