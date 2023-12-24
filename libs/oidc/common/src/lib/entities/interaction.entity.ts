import { PrimaryColumn, Entity, Column } from 'typeorm';
import { IRequiredEntityAttrs } from './required-entity-attrs';

@Entity({
  name: 'interaction',
})
export class Interaction implements IRequiredEntityAttrs {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
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

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public grantId: string;
}
