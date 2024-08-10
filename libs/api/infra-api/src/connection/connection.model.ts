import { OmitType, PartialType } from '@nestjs/swagger';
import { PageQuery } from 'libs/common/src/pagination/pagination.model';

export class ConnectionModel {
  id: string;
  name: string;
  strategy?: string;
  display_name?: string;
  options?: Record<string, any>;
  metadata?: Record<string, any>;
  tenant?: string;
  created_at?: Date;
  updated_at?: Date;
  icon: string;
  realms: string[];
  is_domain_connection: boolean;
  enabled_clients: string[];
}

export class CreateConnectionModel extends PartialType(OmitType(ConnectionModel, [
  'id',
])) {}

export class UpdateConnectionModel extends PartialType(OmitType(CreateConnectionModel, ['name'])) {}

export class ConnectionPageQuery implements PageQuery {
  strategy?: string | string[];
  name?: string | string[];
  strategy_type?: string;
}