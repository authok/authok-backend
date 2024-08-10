import { Injectable, Inject } from "@nestjs/common";
import { ProxyQueryService, QueryRepository } from "@libs/nest-core";
import { 
  CreateCustomDomainModel, 
  CustomDomainModel, 
  UpdateCustomDomainModel,
  ICustomDomainService,
} from "libs/api/infra-api/src";

@Injectable()
export class CustomDomainService extends ProxyQueryService<CustomDomainModel, CreateCustomDomainModel, UpdateCustomDomainModel> implements ICustomDomainService {
  constructor(
    @Inject('CustomDomainMapperQueryRepository') customDomainRepository: QueryRepository<CustomDomainModel, CreateCustomDomainModel, UpdateCustomDomainModel>,
  ) {
    super(customDomainRepository)
  }
}