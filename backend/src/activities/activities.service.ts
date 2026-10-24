import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
    private auditService: AuditService,
  ) {}

  async getPublicActivities(category?: string): Promise<Activity[]> {
    const query = this.activityRepo
      .createQueryBuilder('activity')
      .where('activity.isPublished = :isPublished', { isPublished: true })
      .orderBy('activity.displayOrder', 'ASC')
      .addOrderBy('activity.createdAt', 'DESC');

    if (category) {
      query.andWhere('activity.category = :category', { category });
    }

    return query.getMany();
  }

  async getPublicActivityBySlug(slug: string): Promise<Activity> {
    const activity = await this.activityRepo.findOne({
      where: { slug, isPublished: true },
    });
    if (!activity) {
      throw new NotFoundException(`Activity with slug "${slug}" not found`);
    }
    return activity;
  }

  async getAllActivitiesAdmin(): Promise<Activity[]> {
    return this.activityRepo.find({
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async createActivity(
    dto: CreateActivityDto,
    adminId?: string,
    adminEmail?: string,
  ): Promise<Activity> {
    const existing = await this.activityRepo.findOne({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException(`An activity with slug "${dto.slug}" already exists`);
    }

    const activity = this.activityRepo.create(dto);
    const saved = await this.activityRepo.save(activity);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'CREATE_ACTIVITY',
      entityType: 'ACTIVITY',
      entityId: saved.id,
      details: { title: saved.title, slug: saved.slug },
    });

    return saved;
  }

  async updateActivity(
    id: string,
    dto: Partial<CreateActivityDto>,
    adminId?: string,
    adminEmail?: string,
  ): Promise<Activity> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }

    if (dto.slug && dto.slug !== activity.slug) {
      const existing = await this.activityRepo.findOne({ where: { slug: dto.slug } });
      if (existing) {
        throw new ConflictException(`An activity with slug "${dto.slug}" already exists`);
      }
    }

    Object.assign(activity, dto);
    const updated = await this.activityRepo.save(activity);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPDATE_ACTIVITY',
      entityType: 'ACTIVITY',
      entityId: id,
      details: { title: updated.title, changes: dto },
    });

    return updated;
  }

  async deleteActivity(
    id: string,
    adminId?: string,
    adminEmail?: string,
  ): Promise<{ message: string }> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }

    await this.activityRepo.remove(activity);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'DELETE_ACTIVITY',
      entityType: 'ACTIVITY',
      entityId: id,
      details: { title: activity.title },
    });

    return { message: 'Activity deleted successfully' };
  }
}
