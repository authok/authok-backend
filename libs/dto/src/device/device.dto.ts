import { ApiProperty } from '@nestjs/swagger';

export class DeviceDto {
  @ApiProperty()
  readonly id: string;
}

export class CreateDeviceDto {}

export class UpdateDeviceDto {}
