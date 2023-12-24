import { plainToClass } from "class-transformer";
import { OrganizationEnabledConnectionDto } from 'libs/api/infra-api/src/organization/organization.dto';
import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { OrganizationEnabledConnectionEntity } from "./enabled-connection.entity";
import { ConnectionDto } from "libs/api/infra-api/src/connection/connection.dto";

@Mapper(OrganizationEnabledConnectionDto, OrganizationEnabledConnectionEntity)
export class OrganizationEnabledConnectionMapper extends ClassTransformerMapper<OrganizationEnabledConnectionDto, OrganizationEnabledConnectionEntity> {
  convertToDTO(entity: OrganizationEnabledConnectionEntity): OrganizationEnabledConnectionDto {
    const { connection, ...rest } = entity;
    
    const dto = super.convertToDTO(rest as OrganizationEnabledConnectionEntity);
    if (connection) {
      dto.connection = plainToClass(ConnectionDto, connection);
    }

    return dto;
  }

  convertToEntity(dto: OrganizationEnabledConnectionDto): OrganizationEnabledConnectionEntity {
    const { connection, ...rest } = dto;

    const entity = super.convertToEntity(rest as OrganizationEnabledConnectionDto);

    return entity;
  }
}