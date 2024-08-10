import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'devices',
})
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;
}