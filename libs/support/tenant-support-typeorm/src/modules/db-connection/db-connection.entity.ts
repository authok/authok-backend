import {
  GUID,
  GuidIdentity,
} from '@libs/support/infra-support-typeorm/common/guid.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'dbconnections',
})
@GUID()
export class DBConnectionEntity extends GuidIdentity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  database: string;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  synchronize: boolean;

  @Column({ nullable: true, default: 'Z' })
  timezone: string;

  @Column({ default: false })
  logging: boolean;
}
