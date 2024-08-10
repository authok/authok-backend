import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { RuleDto, CreateRuleDto, UpdateRuleDto } from './rule.dto';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

@ApiTags('Role - API')
@Controller('/v2/rules')
export class RuleController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: '获取' })
  async paginate(
    @Query() query: PageQueryDto,
  ): Promise<PageDto<RuleDto>> {
    // TODO
    return null;
  }

  @Post()
  async create(@Body() rule: CreateRuleDto): Promise<RuleDto> {
    // TODO
    return null;
  }

  @Get(':id')
  @ApiOperation({ summary: '获取' })
  async retrieve(@Param('id') id: string): Promise<RuleDto | undefined> {
    // TODO
    return null;
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  async delete(@Param('id') id: string) {
    // TODO
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新' })
  async update(@Body() req: UpdateRuleDto): Promise<RuleDto | undefined> {
    // TODO
    return null;
  }
}
