import { UserDto } from "../user/user.dto";

export class TenantCreatedEvent {
  id: string;

  creator: UserDto;
}
