
import { BaseEntity, Entity, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn, RelationId, ManyToOne, Column, JoinColumn, PrimaryColumn } from "typeorm";
import { ActionEntity } from "../action/action.entity";
import { TriggerEntity } from "../trigger/trigger.entity";

@Entity({
  name: 'trigger_bindings',
  orderBy: {
    index: 'ASC',
  }
})
export class TriggerBindingEntity extends BaseEntity {
  // 这里必须用 uuid
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  display_name: string;

  @Column({
    nullable: false,
    default: 0,
  })
  index: number;

  // 主要为了规避 mysql 查询重复列的问题
  @Column({ 
    select: false, 
    ...(process.env.DRIVER === 'mysql' && { length: 36}),
  })
  trigger_id: string;

  // 主要为了规避 mysql 查询重复列的问题
  @Column({ 
    select: false, 
    ...(process.env.DRIVER === 'mysql' && { length: 36}),
  })
  action_id: string;

  @ManyToOne(() => TriggerEntity, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'trigger_id',
    referencedColumnName: 'id',
  })
  @JoinColumn({
    name: 'tenant',
    referencedColumnName: 'tenant',
  })
  trigger: TriggerEntity;

  @RelationId((triggerBinding: TriggerBindingEntity) => triggerBinding.trigger)
  trigger_relation_id: { tenant: string; trigger_id: string; };

  @ManyToOne(() => ActionEntity, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'action_id',
    referencedColumnName: 'id',
  })
  action: ActionEntity;

  @RelationId((triggerBinding: TriggerBindingEntity) => triggerBinding.action)
  action_relation_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}