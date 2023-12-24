import { Injectable, Inject } from "@nestjs/common";
import { ICustomDomainService } from "libs/api/infra-api/src/custom-domain/custom-domain.service";
import { ProxyQueryService, QueryRepository } from "@libs/nest-core";
import { CreateCustomDomainDto, CustomDomainDto, UpdateCustomDomainDto } from "libs/api/infra-api/src/custom-domain/custom-domain.dto";

@Injectable()
export class CustomDomainService extends ProxyQueryService<CustomDomainDto, CreateCustomDomainDto, UpdateCustomDomainDto> implements ICustomDomainService {
  constructor(
    @Inject('CustomDomainMapperQueryRepository') customDomainRepository: QueryRepository<CustomDomainDto, CreateCustomDomainDto, UpdateCustomDomainDto>,
  ) {
    super(customDomainRepository)
  }
}