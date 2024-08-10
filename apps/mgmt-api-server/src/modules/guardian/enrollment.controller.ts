import { Controller, Get, UseGuards, Delete, Inject, Req, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { IEnrollmentService } from 'libs/api/infra-api/src';
import { EnrollmentDto, UpdateEnrollmentDto } from 'libs/dto/src';
import { TenantGuard } from '../../middleware/tenant.guard';
import { IRequestContext, ReqCtx } from '@libs/nest-core';

@ApiTags('Guardian/enrollment - API')
@Controller('/api/v2/guardian/enrollments')
@UseGuards(ScopesGuard)
@UseGuards(TenantGuard)
export class EnrollmentController {
  constructor(
    @Inject('IEnrollmentService')
    private readonly enrollmentService: IEnrollmentService,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve an enrollment (including its status and type).',
  })
  @Scopes('read:guardian_enrollments')
  async retrieve(@ReqCtx() ctx: IRequestContext, @Param('id') id: string): Promise<EnrollmentDto | undefined> {
    return await this.enrollmentService.retrieve(ctx, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete an enrollment to allow the user to enroll with multi-factor authentication again.',
  })
  @Scopes('delete:guardian_enrollments')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string): Promise<void> {
    await this.enrollmentService.delete(ctx, id);
  }

  @Patch(':id')
  async update(@ReqCtx() ctx: IRequestContext, @Param('id') id: string, data: UpdateEnrollmentDto): Promise<EnrollmentDto> {
    const enrollment = { id, ...data };
    return await this.enrollmentService.update(ctx, enrollment);
  }
}