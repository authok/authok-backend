import { Controller, Body, Get, UseGuards, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JobDto } from 'libs/dto/src';

class ImportUsersBody {
  @ApiProperty({ name: 'connection_id' })
  readonly connectionId: string;

  @ApiProperty()
  readonly upsert: boolean;

  @ApiProperty({ name: 'external_id' })
  readonly externalId: string;

  @ApiProperty({ name: 'send_completion_email' })
  readonly sendCompletionEmail: boolean;
}

class SendVerificationEmailIdentityDto {
  @ApiProperty({
    description: 'user_id of the identity to be verified.',
  })
  readonly user_id: string;

  @ApiProperty({
    description: 'Identity provider name of the identity (e.g. google-oauth2).',
  })
  readonly provider: string;
}

class SendVerificationEmailDto {
  @ApiProperty({ required: true })
  readonly user_id: string;

  @ApiProperty()
  readonly client_id: string;

  @ApiProperty({ name: 'identity' })
  readonly identity: SendVerificationEmailIdentityDto;

  @ApiProperty({
    name: 'organization_id',
    description:
      '(Optional) Organization ID – the ID of the Organization. If provided, organization parameters will be made available to the email template and organization branding will be applied to the prompt. In addition, the redirect link in the prompt will include organization_id and organization_name query string parameters.',
  })
  readonly organizationId: string;
}

@ApiTags('Job - API')
@Controller('/v2/jobs')
@UseGuards(AuthGuard(), ScopesGuard)
export class JobController {
  constructor() {}
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieves a job. Useful to check its status.',
  })
  @Scopes('create:users', 'read:users')
  async retrieve(): Promise<JobDto> {
    // TODO
    return null;
  }

  @Get(':id/errors')
  @ApiOperation({
    summary: 'Retrieve error details of a failed job.',
  })
  @Scopes('create:users', 'read:users')
  async getErrors(): Promise<any[]> {
    // TODO
    return null;
  }

  @Post('users-export')
  @ApiOperation({
    summary: 'Export all users to a file via a long-running job.',
  })
  @Scopes('read:users')
  async exportUsers(): Promise<JobDto> {
    // TODO
    return null;
  }

  @Post('users-imports')
  @ApiOperation({
    summary:
      'Import users from a formatted file into a connection via a long-running job.',
  })
  @Scopes('create:users')
  async importUsers(@Body() body: ImportUsersBody): Promise<JobDto> {
    // TODO
    return null;
  }

  @Post('verification-email')
  @ApiOperation({
    summary:
      'Send an email to the specified user that asks them to click a link to verify their email address.',
  })
  @Scopes('update:users')
  async sendVerificationEmail(
    @Body() body: SendVerificationEmailDto,
  ): Promise<JobDto> {
    // TODO
    return null;
  }
}
