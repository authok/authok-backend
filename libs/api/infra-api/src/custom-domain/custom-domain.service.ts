import { QueryService } from '@libs/nest-core';
import { CustomDomainDto, UpdateCustomDomainDto, CreateCustomDomainDto } from './custom-domain.dto';

export interface ICustomDomainService extends QueryService<CustomDomainDto, CreateCustomDomainDto, UpdateCustomDomainDto> {
}
