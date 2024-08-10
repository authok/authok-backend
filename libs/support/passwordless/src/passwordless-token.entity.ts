import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Unique } from 'typeorm';

@Entity({
  name: 'passwordless_tokens',
})
@Unique('idx_token_scene_key', ['scene', 'key'])
export class PasswordlessToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 16 })
  scene: string;

  @Column({ length: 36 })
  key: string;

  @Column()
  value: string;

  @Column()
  expired_at: Date;

  @Column()
  @CreateDateColumn()
  created_at: Date;
}
