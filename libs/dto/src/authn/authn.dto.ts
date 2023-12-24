import { ApiProperty } from '@nestjs/swagger';

export class UsernamepasswordLoginReq {
  @ApiProperty({ name: 'client_id' })
  clientId: string;

  @ApiProperty({ name: 'connection' })
  connection: string;

  @ApiProperty({ name: 'password' })
  password: string;

  @ApiProperty({ name: 'popup_options' })
  popupOptions: unknown;

  @ApiProperty({ name: 'prompt', example: 'login' })
  prompt: string;

  @ApiProperty({
    name: 'protocol',
    description: 'e.g.: oauth',
    example: 'oauth',
  })
  protocol: string;

  @ApiProperty({ name: 'redirect_uri' })
  redirectUri: string;

  @ApiProperty({ name: 'response_type' })
  responseType: string;

  @ApiProperty({ name: 'scope' })
  scope: string;

  @ApiProperty({ name: 'sso' })
  sso: boolean;

  @ApiProperty({ name: 'state' })
  state: string;

  @ApiProperty({ name: 'tenant' })
  tenant: string;

  @ApiProperty({ name: 'username' })
  username: string;
}
