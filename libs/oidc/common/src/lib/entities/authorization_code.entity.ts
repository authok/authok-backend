import { Column, PrimaryColumn, Entity } from 'typeorm';
import { IRequiredEntityAttrs } from './required-entity-attrs';

@Entity({
  name: 'authorization_codes',
})
export class AuthorizationCode implements IRequiredEntityAttrs {
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
  })
  public expiresAt: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public consumedAt: Date;
}
