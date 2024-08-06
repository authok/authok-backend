import { OmitType, PartialType } from '@nestjs/swagger';
import { BrandingModel } from '../branding/branding.model';
import { ConnectionModel } from '../connection/connection.model';
import { PageQuery } from 'libs/common/src/pagination/pagination.model';

export class OrganizationModel {
  id: string;
  name: string;
  display_name: string;
  branding: BrandingModel;
  metadata?: any;
}

export class CreateOrganizationModel extends PartialType(OmitType(OrganizationModel, ['id'])) {}

export class UpdateOrganizationModel extends PartialType(OmitType(OrganizationModel, ['id', 'name'])) {}

export class OrganizationPageQuery implements PageQuery {}

export class OrganizationMemberPageQuery implements PageQuery {  
}

export class AddOrganizationMembers {
  members: string[];
}

export class RemoveOrganizationMembers {
  members: string[];
}

export class OrganizationEnabledConnection {
  connection_id: string;
  assign_membership_on_login: boolean;
  connection: ConnectionModel;
}

export class UpdateOrganizationEnabledConnection extends OmitType(OrganizationEnabledConnection, [
  'connection_id',
  'connection',
]) {}

export class AddOrganizationEnabledConnection extends PartialType(OmitType(OrganizationEnabledConnection, ['connection'])) {
  connection_id: string;
  assign_membership_on_login: boolean;
}