import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'password_history',
})
export class PasswordHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  @JoinColumn({ name: 'tenant', referencedColumnName: 'tenant' })
  public user: UserEntity;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public used_password: string;
}
