import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id', length: 36, nullable: true })
  adminId: string;

  @Column({ name: 'admin_email', length: 255, nullable: true })
  adminEmail: string;

  @Column({ length: 100 })
  action: string;

  @Column({ name: 'entity_type', length: 100 })
  entityType: string;

  @Column({ name: 'entity_id', length: 100, nullable: true })
  entityId: string;

  @Column({ type: 'json', nullable: true })
  details: Record<string, any> | null;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
