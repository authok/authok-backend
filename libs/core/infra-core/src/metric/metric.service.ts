import { Injectable, Inject } from "@nestjs/common";
import { ProxyQueryService, QueryRepository } from "@libs/nest-core";
import { IMetricService } from "libs/api/infra-api/src/metric/metric.service";
import { MetricDto } from "libs/api/infra-api/src/metric/metric.dto";

@Injectable()
export class MetricService extends ProxyQueryService<MetricDto> implements IMetricService {
  constructor(
    @Inject('MetricMapperQueryRepository') metricRepository: QueryRepository<MetricDto>,
  ) {
    super(metricRepository);
  }
}