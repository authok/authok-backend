import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm/index';

import { Exclude } from 'class-transformer';

@Entity({
  name: 'keys',
})
export class KeyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  kid: string;

  @Column({ nullable: true })
  tenant: string;

  @Column({ type: 'text', comment: 'The private key of pem format', nullable: true })
  pkcs8: string;

  @Column({ type: 'text', comment: 'The public key of pem format', nullable: true })
  spki: string;

  @Column({ type: 'text', comment: 'The public certificate of the signing key', nullable: true })
  cert: string;

  @Column({
    type: 'text',
    comment: 'The public certificate of the signing key in pkcs7 format',
    nullable: true
  })
  pkcs7: string;

  @Column({ comment: 'True if the key is the the current key', nullable: true })
  current: boolean;

  @Column({ comment: 'True if the key is the the next key', nullable: true })
  next: boolean;

  @Column({
    comment: 'True if the key is the the previous key',
    nullable: true,
  })
  previous: boolean;

  @Column({
    name: 'current_since',
    comment: 'The date and time when the key became the current key',
    nullable: true,
  })
  currentSince: Date;

  @Column({
    name: 'current_until',
    comment: 'The date and time when the current key was rotated',
    nullable: true,
  })
  currentUntil: Date;

  @Column({
    comment: 'The cert fingerprint',
  })
  fingerprint: string;

  @Column({
    comment: 'The cert thumbprint',
  })
  thumbprint: string;

  @Column({
    comment: 'True if the key is revoked',
    default: false,
  })
  revoked: boolean;

  @Column({
    name: 'revoked_at',
    comment: 'The date and time when the key was revoked',
    nullable: true,
  })
  revokedAt: Date;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at: Date;
}
