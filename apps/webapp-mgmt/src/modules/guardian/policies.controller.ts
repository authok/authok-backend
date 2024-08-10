import { Controller, Body, Get, Put, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdatePoliciesDto, PolicyDto } from 'libs/dto/src';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Guardian/policies - API')
@Controller('/v2/guardian/policies')
export class PolicyController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: 'Gets the MFA policies for the tenant.' })
  async getPolices(): Promise<PolicyDto[] | undefined> {
    // TODO
    return null;
  }

  @Put()
  @ApiOperation({ summary: 'Sets the MFA policies for the tenant.' })
  @Scopes('update:mfa_policies')
  async updatePolicies(
    @Body() req: UpdatePoliciesDto,
  ): Promise<PolicyDto | undefined> {
    // TODO
    return null;
  }
}
