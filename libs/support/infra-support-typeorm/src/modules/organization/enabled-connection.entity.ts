import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { ConnectionEntity } from '../connection/connection.entity';

@Entity({
  name: 'organization_enabled_connections',
})
export class OrganizationEnabledConnectionEntity extends BaseEntity {
  @PrimaryColumn({ name: 'pk_organization_id', length: 48 })
  organization_id: string;

  @PrimaryColumn({ name: 'pk_connection_id', length: 48 })
  connection_id: string;

  @ManyToOne(() => OrganizationEntity, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'pk_organization_id',
    referencedColumnName: 'id',
  })
  organization: OrganizationEntity;

  @ManyToOne(() => ConnectionEntity, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'pk_connection_id',
    referencedColumnName: 'id',
  })
  connection: ConnectionEntity;

  @Column({ default: false })
  assign_membership_on_login: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}