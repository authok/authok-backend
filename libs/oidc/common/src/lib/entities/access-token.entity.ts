import { PrimaryColumn, Entity, Column, EntityRepository } from 'typeorm';
import { IRequiredEntityAttrs } from './required-entity-attrs';

@Entity({
  name: 'access_tokens',
})
export class AccessToken implements IRequiredEntityAttrs {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
  })
  public id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public grantId: string;

  @Column({
    type: 'text',
    nullable: true,
    // length: 'max',
  })
  public data: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: '128',
  })
  public clientId: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: '128',
  })
  public accountGuid: string;

  @Column({
    // type: 'datetime',
    nullable: true,
  })
  public expiresAt: Date;

  @Column({
    // type: 'datetime',
    nullable: true,
  })
  public consumedAt: Date;

  @Column({
    // type: 'datetime',
    nullable: true,
  })
  public added: Date;
}

@EntityRepository(AccessToken)
export class AccessTokenRepo {}
