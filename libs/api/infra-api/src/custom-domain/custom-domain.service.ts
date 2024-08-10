import { QueryService } from '@libs/nest-core';
import { CustomDomainModel, UpdateCustomDomainModel, CreateCustomDomainModel } from './custom-domain.model';

export interface ICustomDomainService extends QueryService<CustomDomainModel, CreateCustomDomainModel, UpdateCustomDomainModel> {
}
