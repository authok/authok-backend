import { IRequestContext } from "@libs/nest-core";
import { Injectable } from "@nestjs/common";
import { Factor } from "libs/api/infra-api/src/guardian/factor/factor.model";
import { IFactorService } from "libs/api/infra-api/src/guardian/factor/factor.service";

@Injectable()
export class FactorService implements IFactorService {
  async get(ctx: IRequestContext): Promise<Factor[]> {
    return [];
  }
}