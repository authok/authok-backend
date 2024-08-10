import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { MetricModel } from "libs/api/infra-api/src";
import { MetricEntity } from "./metric.entity";

@Mapper(MetricModel, MetricEntity)
export class MetricMapper extends ClassTransformerMapper<MetricModel, MetricEntity> {
  convertToDTO(entity: MetricEntity): MetricModel {
    const { tenant, ...rest } = entity;

    return super.convertToDTO(rest as MetricEntity);
  }
}