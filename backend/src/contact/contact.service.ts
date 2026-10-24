import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    @InjectRepository(ContactMessage)
    private contactRepo: Repository<ContactMessage>,
    private auditService: AuditService,
  ) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_USER !== 'mock_user') {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } catch (err) {
        console.warn('SMTP transporter initialization skipped:', err);
      }
    }
  }

  async submitMessage(
    dto: CreateContactMessageDto,
    ipAddress?: string,
  ): Promise<{ success: boolean; message: string }> {
    // Basic rate limit / spam guard: check if identical message was sent from this IP in the last 60 seconds
    if (ipAddress) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recent = await this.contactRepo
        .createQueryBuilder('c')
        .where('c.ipAddress = :ipAddress', { ipAddress })
        .andWhere('c.createdAt >= :oneMinuteAgo', { oneMinuteAgo })
        .getCount();

      if (recent >= 3) {
        throw new BadRequestException('Too many inquiries. Please wait a minute before submitting again.');
      }
    }

    const messageEntity = this.contactRepo.create({
      ...dto,
      ipAddress,
    });
    await this.contactRepo.save(messageEntity);

    // Send email notification to centre if configured
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'alfalahcsc@hotmail.com';
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || 'Alfalah CSC <no-reply@alfalahcsc.com>',
          to: recipient,
          subject: `[Alfalah Portal Inquiry] ${dto.subject}`,
          text: `New contact submission received:\n\nName: ${dto.name}\nEmail: ${dto.email}\nSubject: ${dto.subject}\n\nMessage:\n${dto.message}`,
        });
      } catch (emailErr) {
        console.warn('Email dispatch failed, but message is safely stored in database:', emailErr);
      }
    } else {
      console.log(`[Development Mock Mail] New contact submission saved from ${dto.name} (${dto.email}): ${dto.subject}`);
    }

    return {
      success: true,
      message: 'Thank you for reaching out. Your message has been received and our team will get in touch shortly.',
    };
  }

  async getAllMessagesAdmin(): Promise<ContactMessage[]> {
    return this.contactRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, isRead = true): Promise<ContactMessage> {
    const msg = await this.contactRepo.findOne({ where: { id } });
    if (!msg) {
      throw new BadRequestException(`Message with id ${id} not found`);
    }
    msg.isRead = isRead;
    return this.contactRepo.save(msg);
  }
}
