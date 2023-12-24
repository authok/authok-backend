import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { MetricDto } from "libs/api/infra-api/src/metric/metric.dto";
import { MetricEntity } from "./metric.entity";

@Mapper(MetricDto, MetricEntity)
export class MetricMapper extends ClassTransformerMapper<MetricDto, MetricEntity> {
  convertToDTO(entity: MetricEntity): MetricDto {
    const { tenant, ...rest } = entity;

    return super.convertToDTO(rest as MetricEntity);
  }
}