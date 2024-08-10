import {
  Controller,
  Get,
  UseGuards,
  Inject,
  Param,
  Query,
} from '@nestjs/common';

import { Throttle } from '@nestjs/throttler';
import { TenantGuard } from '../../middleware/tenant.guard';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { IMetricService } from 'libs/api/infra-api/src';
import { SortDirection } from '@libs/nest-core';
import { MetricDto, PeriodDto } from 'libs/dto/src';

@Controller('/api/v2/stats')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(TenantGuard)
export class StatsController {
  constructor(
    @Inject('IMetricService')
    private readonly metricService: IMetricService,
  ) {}

  @Get(':key')
  async get(
    @ReqCtx() ctx: IRequestContext,
    @Param('key') key: string,
    @Query('period') period: PeriodDto = PeriodDto.all,
    @Query('time') time: string,
    @Query('begin_time') begin_time: string,
    @Query('end_time') end_time: string,
  ): Promise<MetricDto[]> {
    return await this.metricService.query(ctx, {
      paging: {
        limit: 1000,
      },
      filter: {
        and: [
          {
            key: {
              eq: key,
            },
            period: {
              eq: period,
            },
            time: {
              ...(time && { eq: time }),
              ...(begin_time && { gte: begin_time}),
              ...(end_time && { lt: end_time}),
            }
          }
        ]
      },
      sorting: [
        {
          field: 'time',
          direction: SortDirection.ASC,
        }
      ]
    }) as any;
  }
}