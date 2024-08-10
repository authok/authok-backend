import { PrimaryGeneratedColumn, Entity, ManyToMany, JoinTable, Column, UpdateDateColumn, CreateDateColumn, BaseEntity, Unique } from "typeorm";
import { TriggerEntity } from "../trigger/trigger.entity";
import { DependencyModel, SecretModel } from 'libs/api/infra-api/src';

@Entity({
  name: 'actions'
})
@Unique('idx_action_tenant_name', ['tenant', 'name'])
export class ActionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ length: 36 })
  tenant: string;

  @Column({ length: 32 })
  name: string;

  @ManyToMany(() => TriggerEntity, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({
    name: 'action_supported_triggers',
    joinColumns: [
      {
        name: 'action_id',
        referencedColumnName: 'id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'tenant',
        referencedColumnName: 'tenant',
      },
      {
        name: 'trigger_id',
        referencedColumnName: 'id',
      },
    ],
  })
  supported_triggers: TriggerEntity[];

  @Column({ type: 'text', nullable: true })
  code: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  dependencies: DependencyModel[];

  @Column({ nullable: true })
  runtime: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  secrets: SecretModel[];

  // @Column({ nullable: true })
  // deployed_version: ActionVersion;

  @Column({ nullable: true, length: 48 })
  installed_integration_id: string;

  // @ManyToOne()
  // integration: IntegrationDto;

  @Column({ nullable: true, default: 'pending', length: 12 })
  status: string;

  @Column({ default: false })
  all_changes_deployed: boolean;

  @Column({ nullable: true })
  built_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}