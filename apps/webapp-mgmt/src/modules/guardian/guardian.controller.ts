import { Controller, Body, Get, Put, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FactorDto } from 'libs/dto/src';

@ApiTags('Guardian - API')
@Controller('/v2/guardian')
export class GuardianController {
  constructor() {}

  @Get('provider')
  @ApiOperation({
    summary: '',
  })
  async factors(): Promise<FactorDto[] | undefined> {
    // TODO
    return null;
  }
}
