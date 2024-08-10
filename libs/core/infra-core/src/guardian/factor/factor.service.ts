import { IContext } from "@libs/nest-core";
import { Injectable } from "@nestjs/common";
import { FactorModel, IFactorService } from "libs/api/infra-api/src";

@Injectable()
export class FactorService implements IFactorService {
  async get(ctx: IContext): Promise<FactorModel[]> {
    return [];
  }
}