import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm/index';
import { GuidIdentity } from '../../common/guid.entity';
import { ClientEntity } from '../client/client.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'grants',
})
export class GrantEntity extends GuidIdentity {
  @ManyToOne(() => UserEntity, {
    eager: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'fk_user_id',
    referencedColumnName: 'user_id',
  })
  @JoinColumn({
    name: 'tenant',
    referencedColumnName: 'tenant',
  })
  user: UserEntity;

  @Column({ name: 'fk_user_id', length: 80 })
  user_id: string;

  @Column({ length: 36 })
  tenant: string;

  @Column({ length: 36 })
  client_id: string;

  @ManyToOne(() => ClientEntity, {
    eager: false,
    cascade: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'client_id',
  })
  client: ClientEntity;

  @Column({ type: 'simple-json', nullable: true })
  resources: Record<string, any>;

  @Column({ nullable: true, type: 'simple-json' })
  openid: any;

  @Column({ nullable: true, type: 'simple-json' })
  rejected: any;

  @Column({ nullable: true })
  iat: number;

  @Column({ nullable: true })
  exp: number;

  @Column({
    type: 'text',
    nullable: true,
    // length: 'max',
  })
  public data: string;
}