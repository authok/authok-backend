import { PrimaryColumn, Column, Entity } from 'typeorm';
import { IRequiredEntityAttrs } from './required-entity-attrs';

@Entity({
  name: 'initial_access_tokens',
})
export class InitialAccessToken implements IRequiredEntityAttrs {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    length: 48,
  })
  public id: string;

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
