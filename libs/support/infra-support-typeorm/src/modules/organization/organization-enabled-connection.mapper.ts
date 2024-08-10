import { plainToClass } from "class-transformer";
import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { OrganizationEnabledConnectionEntity } from "./enabled-connection.entity";
import { OrganizationEnabledConnection, ConnectionModel } from "libs/api/infra-api/src";

@Mapper(OrganizationEnabledConnection, OrganizationEnabledConnectionEntity)
export class OrganizationEnabledConnectionMapper extends ClassTransformerMapper<OrganizationEnabledConnection, OrganizationEnabledConnectionEntity> {
  convertToDTO(entity: OrganizationEnabledConnectionEntity): OrganizationEnabledConnection {
    const { connection, ...rest } = entity;
    
    const dto = super.convertToDTO(rest as OrganizationEnabledConnectionEntity);
    if (connection) {
      dto.connection = plainToClass(ConnectionModel, connection);
    }

    return dto;
  }

  convertToEntity(dto: OrganizationEnabledConnection): OrganizationEnabledConnectionEntity {
    const { connection, ...rest } = dto;

    const entity = super.convertToEntity(rest as OrganizationEnabledConnection);

    return entity;
  }
}