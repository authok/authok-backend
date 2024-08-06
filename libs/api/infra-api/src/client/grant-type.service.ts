import { GrantTypeModel } from './grant-type.model';

export interface IGrantTypeService {
  findByTypes(types: string[]): Promise<GrantTypeModel[]>;

  findAll(): Promise<GrantTypeModel[]>;

  retrieve(id: string): Promise<GrantTypeModel | undefined>;

  update(id: string, body: Partial<GrantTypeModel>);

  delete(id: string): Promise<void>;

  create(body: Partial<GrantTypeModel>): Promise<GrantTypeModel>;
}
