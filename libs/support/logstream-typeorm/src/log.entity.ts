import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@Entity({
  name: 'log_events'
})
export class LogEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant: string;

  @Column()
  date: Date;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  connection: string;

  @Column({ nullable: true })
  connection_id: string;

  @Column({ nullable: true })
  client_id: string;

  @Column({ nullable: true })
  client_name: string;

  @Column()
  ip: string;

  @Column()
  hostname: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  user_name: string;

  @Column({ nullable: true })
  audience: string;

  @Column({ nullable: true })
  scope: string;

  @Column({ nullable: true })
  strategy: string;

  @Column({ nullable: true })
  strategy_type: string;

  @Column({ nullable: true })
  is_mobile: boolean;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  details: Record<string, any>;

  @Column({ nullable: true })
  user_agent: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  location_info: Record<string, any>;
}
