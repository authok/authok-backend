import { UserModel } from "../user/user.model";

export class TenantCreatedEvent {
  id: string;

  creator: UserModel;
}
