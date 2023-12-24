import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
import { Exclude } from "class-transformer";

@Entity({
  name: 'configs'
})
export class ConfigEntity extends BaseEntity {
  @Exclude()
  @PrimaryColumn({ length: 36 })
  tenant: string;
  
  @PrimaryColumn({ length: 32 })
  namespace?: string;

  @PrimaryColumn({ length: 32 })
  name: string;  

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'simple-json', nullable: true })
  value: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}