import {
  PrimaryColumn,
  BeforeUpdate,
  BeforeInsert,
  BaseEntity,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';
// eslint-disable-next-line @typescript-eslint/ban-types
type ClassDecorator = <TFunction extends Function>(
  target: TFunction,
) => TFunction | void;

export function GUID(opt: { prefix?: string; len?: number } = { len: 24 }): ClassDecorator {
  return (target) => {
    target.prototype.__prefix = opt?.prefix;
    target.prototype.__len = opt?.len || 24;
  };
}

@Entity()
export abstract class GuidIdentity extends BaseEntity {
  @PrimaryColumn({ length: 48 })
  public id: string;

  @BeforeInsert()
  protected generateGuid(): void {
    if (this.id === undefined) {
      const len = this.constructor.prototype.__len;
      const prefix = this.constructor.prototype.__prefix;

      const id = nanoid(len);
      this.id = prefix ? prefix + '_' + id : id;
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
