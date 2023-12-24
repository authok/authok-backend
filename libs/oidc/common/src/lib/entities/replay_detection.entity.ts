import { IRequiredEntityAttrs } from './required-entity-attrs';
import { PrimaryColumn, Entity, Column } from 'typeorm';

@Entity({
  name: 'replay_detection',
})
export class ReplayDetection implements IRequiredEntityAttrs {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    length: 48,
  })
  public id: string;

  @Column({
    type: 'text',
    nullable: true,
    // length: 'max',
  })
  public data: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public expiresAt: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public consumedAt: Date;
}
