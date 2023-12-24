import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { v4 as guid } from 'uuid';

@Entity()
export class GuidIdentity extends BaseEntity {
  @PrimaryColumn()
  public id: string;

  @BeforeUpdate()
  @BeforeInsert()
  private generateGuid(): void {
    if (this.id === undefined) {
      this.id = guid();
    }
  }
}
