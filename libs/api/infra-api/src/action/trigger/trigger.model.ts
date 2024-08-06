import { OmitType } from "@nestjs/swagger";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

export class TriggerModel {
  id: string;
  display_name: string;
  version: string;
  runtimes: string[];
  default_runtime: string;
  status: string;
}

export class UpdateTriggerModel extends OmitType(TriggerModel, ['id']) {}

export interface TriggerQuery extends PageQuery {
}