import { Controller, Body, Get, Put, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SmsTemplateDto } from 'libs/dto/src';

class GetSelectedProviderRes {
  @ApiProperty()
  readonly provider: string;
}

class UpdateSelectedProviderBody {
  @ApiProperty()
  readonly provider: string;
}

class UpdateSelectedProviderRes {
  @ApiProperty()
  readonly provider: string;
}

@ApiTags('Guardian/sms - API')
@Controller('/v2/guardian/factors/sms')
@UseGuards(AuthGuard(), ScopesGuard)
export class SmsController {
  constructor() {}

  @Get('selected-provider')
  @ApiOperation({
    summary:
      'A new endpoint is available to retrieve the configuration related to phone factors (phone configuration). It has the same payload as this one. Please use it instead.',
  })
  @Scopes('read:guardian_factors')
  async getSelectedProvider(): Promise<GetSelectedProviderRes | undefined> {
    // TODO
    return null;
  }

  @Put('selected-provider')
  @ApiOperation({
    summary:
      'A new endpoint is available to update the configuration related to phone factors (phone configuration). It has the same payload as this one. Please use it instead.',
  })
  @Scopes('update:guardian_factors')
  async updateSelectedProvider(
    @Body() body: UpdateSelectedProviderBody,
  ): Promise<UpdateSelectedProviderRes | undefined> {
    // TODO
    return null;
  }

  @Get('templates')
  @ApiOperation({
    summary:
      'Retrieve SMS enrollment and verification templates (subscription required).',
  })
  @Scopes('read:guardian_factors')
  async getTemplates(): Promise<SmsTemplateDto | undefined> {
    // TODO
    return null;
  }

  @Put('templates')
  @ApiOperation({
    summary:
      'Customize the messages sent to complete SMS enrollment and verification (subscription required).',
  })
  @Scopes('update:guardian_factors')
  async updateTemplates(
    @Body() body: SmsTemplateDto,
  ): Promise<SmsTemplateDto | undefined> {
    // TODO
    return null;
  }
}
