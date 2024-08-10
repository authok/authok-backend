import { BaseEntity, PrimaryColumn, Entity, UpdateDateColumn, CreateDateColumn, Column, Unique } from "typeorm";
import { GuidIdentity } from "../../../common/guid.entity";

@Entity({
  name: 'triggers'
})
@Unique('idx_trigger_tenant_id', ['tenant', 'id'])
export class TriggerEntity extends GuidIdentity {
  @PrimaryColumn({ length: 36 })
  tenant: string;

  @Column({ length: 32 })
  display_name: string;

  @Column({ nullable: true })
  version: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  runtimes: string[];

  @Column({ length: 32 })
  default_runtime: string;

  @Column()
  status: string;
}