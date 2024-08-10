import {
  Column,
  Entity,
  ManyToOne,
  RelationId,
  JoinColumn,
  Unique,
} from 'typeorm/index';

import { GuidIdentity } from '../../common/guid.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'identities',
})
@Unique('idx_identity_conn_uid',['tenant', 'connection', 'user_id'])
export class IdentityEntity extends GuidIdentity {
  @Column({ nullable: true, length: 36 })
  tenant: string;

  @Column({ length: 36 })
  connection: string;

  @Column({ comment: '这里代表 identity provider/connection 中的用户id, 在 provider 中 唯一', length: 64 })
  user_id: string;

  @Column({ length: 80, name: 'fk_user_id' })
  fk_user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.identities, {
    eager: false,
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
  user?: UserEntity;

  @Column()
  provider: string;

  @Column({ default: false })
  is_social: boolean;

  @Column({ nullable: true })
  access_token: string;

  @Column({ nullable: true })
  expires_in: number;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  profile_data: any;

  @Column({ nullable: true })
  last_login: Date;
}