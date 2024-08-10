import {
  Column,
  Entity,
  RelationId,
  ManyToOne,
  JoinColumn,
  Unique,
  BeforeInsert,
} from 'typeorm/index';
import { nanoid } from 'nanoid';
import { GuidIdentity } from '../../common/guid.entity';

@Entity({
  name: 'groups',
})
@Unique('idx_tenant_outer_id', ['tenant', 'type', 'outer_id'])
export class GroupEntity extends GuidIdentity {
  @Column({ nullable: true, length: 48 })
  group_id: string;

  @BeforeInsert()
  protected generateGuid(): void {
    if (this.id === undefined) {
      this.id = nanoid(40);
    }

    if (this.group_id === undefined) {
      if (this.type) {
        if (this.outer_id ) {
          this.group_id = this.type + '|' + this.outer_id;  
        } else {
          this.group_id = this.type + '|' + this.id;
        }
      } else {
        this.group_id = 'authok|' + this.id;
      }
    }
  }

  @Column({
    length: 32,
    default: 'authok',
  })
  type: string;

  @Column({
    length: 36,
  })
  tenant: string;

  @RelationId((group: GroupEntity) => group.parent)
  parent_id: string;

  @Column({ nullable: true, length: 64 })
  outer_id: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => GroupEntity, {
    eager: false,
    cascade: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'parent_id',
    referencedColumnName: 'id',
  })
  parent: Partial<GroupEntity>;

  @Column({ length: 32 })
  name: string;

  @Column({ nullable: true })
  description: string;
}
