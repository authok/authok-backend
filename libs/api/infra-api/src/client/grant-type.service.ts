import { GrantTypeDto } from './grant-type.dto';

export interface IGrantTypeService {
  findByTypes(types: string[]): Promise<GrantTypeDto[]>;

  findAll(): Promise<GrantTypeDto[]>;

  retrieve(id: string): Promise<GrantTypeDto | undefined>;

  update(id: string, body: Partial<GrantTypeDto>);

  delete(id: string): Promise<void>;

  create(body: Partial<GrantTypeDto>): Promise<GrantTypeDto>;
}
