import { Entity, Column, PrimaryColumn } from 'typeorm';
import { IRequiredEntityAttrs } from './required-entity-attrs';

@Entity({
  name: 'device_codes',
})
export class DeviceCode implements IRequiredEntityAttrs {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    length: 48,
  })
  public id: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 48,
  })
  public grantId: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public userCode: string;

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

  constructor() {}
}
