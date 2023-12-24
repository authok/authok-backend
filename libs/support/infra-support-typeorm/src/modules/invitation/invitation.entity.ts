import { GuidIdentity } from "../../common/guid.entity";
import { Entity, Column, ManyToOne, RelationId, JoinColumn } from "typeorm";
import { ClientEntity } from "../client/client.entity";
import { UserEntity } from "../user/user.entity";
import { OrganizationEntity } from "../organization/organization.entity";

@Entity({
  name: 'invitations',
})
export class InvitationEntity extends GuidIdentity {
  @Column({ length: 36 })
  tenant: string;

  @Column({ length: 255 })
  invitation_url: string;

  @RelationId((invitation: InvitationEntity) => invitation.client)
  client_id: string;

  @ManyToOne(() => ClientEntity, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'client_id',
  })
  client: ClientEntity;

  @Column({ nullable: true })
  connection: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
    cascade: false,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'user_id',
  })
  @JoinColumn({
    name: 'tenant',
    referencedColumnName: 'tenant',
  })
  inviter: Partial<UserEntity>;

  // 被邀请对象
  @Column({
    type: 'simple-json',
  })
  invitee: Record<string, any>;

  @ManyToOne(() => OrganizationEntity, {
    eager: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
    referencedColumnName: 'id',
  })
  organization: OrganizationEntity;

  @RelationId((invitation: InvitationEntity) => invitation.organization)
  org_id: string;

  @Column({ length: 60, unique: true })
  ticket: string;

  @Column()
  expires_at: Date;

  @Column({
    type: 'simple-array'
  })
  roles: string[];
}