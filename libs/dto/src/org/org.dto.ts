import { ApiProperty, ApiTags } from '@nestjs/swagger';

/**
 * 一个商户/组织有很多租户
 */
export class OrgDto {
  @ApiProperty()
  readonly id?: string;
}
