import { PageQuery } from "libs/common/src/pagination/pagination.model";
import { UserModel } from "../user/user.model";

export class InvitationModel {
  id: string;
  invitation_url: string;
  client_id: string;
  inviter: Partial<UserModel>;
  invitee: Record<string, any>;
  connection: string;
  ticket: string;
  roles: string[];
  org_id: string;
  created_at: Date;
  expires_at: Date;
  tenant?: string;
}

export class InvitationPageQuery implements PageQuery {
}
