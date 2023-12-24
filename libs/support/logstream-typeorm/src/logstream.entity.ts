import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({
  name: 'log_streams',
})
export class LogStream extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({
    type: 'simple-json',
  })
  sink: Record<string, any>;
}
