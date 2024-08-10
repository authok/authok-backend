import { QueryService } from "@libs/nest-core";
import { MetricModel } from "./metric.model";

export interface IMetricService extends QueryService<MetricModel> {
}