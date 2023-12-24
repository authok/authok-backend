import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";

@Entity({
  name: 'metrics'
})
export class MetricEntity extends BaseEntity {
  @PrimaryColumn({ length: 36 })
  tenant: string;

  @PrimaryColumn({ length: 32 })
  key: string;

  @PrimaryColumn({ length: 12 })
  period: string;

  @PrimaryColumn({ length: 24 })
  time: string;

  @Column()
  value: number;
}