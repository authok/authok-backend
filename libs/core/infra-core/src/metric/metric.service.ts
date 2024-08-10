import { Injectable, Inject } from "@nestjs/common";
import { ProxyQueryService, QueryRepository } from "@libs/nest-core";
import { IMetricService, MetricModel } from "libs/api/infra-api/src";

@Injectable()
export class MetricService extends ProxyQueryService<MetricModel> implements IMetricService {
  constructor(
    @Inject('MetricMapperQueryRepository') metricRepository: QueryRepository<MetricModel>,
  ) {
    super(metricRepository);
  }
}