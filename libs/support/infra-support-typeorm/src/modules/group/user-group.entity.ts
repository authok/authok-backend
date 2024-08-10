import { Entity, ManyToOne, JoinColumn } from "typeorm";
import { GuidIdentity } from "../../common/guid.entity";
import { GroupEntity } from "./group.entity";
import { UserEntity } from "../user/user.entity";

@Entity({
  name: 'user_groups',
})
export class UserGroupEntity extends GuidIdentity {
  @ManyToOne(() => GroupEntity, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  public group: GroupEntity;
  
  @ManyToOne(() => UserEntity, { eager: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  @JoinColumn({ name: 'tenant', referencedColumnName: 'tenant' })
  public user: UserEntity;
}