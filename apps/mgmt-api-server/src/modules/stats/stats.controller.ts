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
import { IMetricService } from 'libs/api/infra-api/src/metric/metric.service';
import { SortDirection } from '@libs/nest-core';
import { Period, MetricDto } from 'libs/api/infra-api/src/metric/metric.dto';

@Controller('/api/v1/stats')
@Throttle(3, 1)
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
    @Query('period') period: Period = Period.all,
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
    });
  }
}