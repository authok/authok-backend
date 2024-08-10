import { UserModel } from '../user/user.model';
import { OrganizationModel } from './organization.model';
import { OrganizationMemberRoleModel } from './organization-member-role.model';

export class OrganizationMemberModel {
  id: string;
  organization: Partial<OrganizationModel>;
  user_id: string;
  picture?: string;
  user_metadata?: Record<string, any>;
  user: Partial<UserModel>;
  tenant: string;
  roles?: OrganizationMemberRoleModel[];
}