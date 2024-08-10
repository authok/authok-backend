import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { KeyDto } from 'libs/dto/src';
import { 
  IKeyService,
  ITenantService,
} from 'libs/api/infra-api/src';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext, ReqCtx } from '@libs/nest-core';

@ApiTags('Key')
@Controller('keys')
export class KeyController {
  constructor(
    @Inject('IKeyService')
    private readonly keyService: IKeyService,
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
  ) {}

  @Get('list')
  @ApiOkResponse({ description: '获取keys', type: KeyDto })
  async list(
    @ReqCtx() ctx: IRequestContext,
  ): Promise<PageDto<KeyDto> | KeyDto[] | null> {
    return null;
  }
}
