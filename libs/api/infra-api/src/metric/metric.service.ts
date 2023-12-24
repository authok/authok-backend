import { QueryService } from "@libs/nest-core";
import { MetricDto } from "./metric.dto";


export interface IMetricService extends QueryService<MetricDto> {
}