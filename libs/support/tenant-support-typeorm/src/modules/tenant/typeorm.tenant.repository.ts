import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantEntity } from './tenant.entity';
import { ITenantRepository } from 'libs/api/infra-api/src/tenant/tenant.repository';
import {
  TenantDto,
  UpdateTenantDto,
  CreateTenantDto,
} from 'libs/api/infra-api/src/tenant/tenant.dto';
import { Repository } from 'typeorm';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { IContext } from '@libs/nest-core';
import { TenantMapper } from './tenant.mapper';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';

@Injectable()
export class TypeOrmTenantRepository implements ITenantRepository {
  @Inject()
  private readonly tenantMapper: TenantMapper;

  constructor(
    @InjectRepository(TenantEntity)
    private readonly repository: Repository<TenantEntity>,
  ) {}

  async retrieve(ctx: IContext, id: string): Promise<TenantDto | undefined> {
    const entity = await this.repository.findOne(id);
    return this.tenantMapper.toDTO(entity);
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<TenantDto | undefined> {
    const entity = await this.repository.findOne({
      where: {
        name,
      },
    });

    return this.tenantMapper.toDTO(entity);
  }

  async update(
    ctx: IContext,
    id: string,
    data: UpdateTenantDto,
  ): Promise<TenantDto> {
    await this.repository.update(id, data);
    const entity = await this.repository.findOneOrFail(id);
    return this.tenantMapper.toDTO(entity);
  }

  async create(ctx: IContext, body: CreateTenantDto): Promise<TenantDto> {
    const entity = await this.repository.save(this.repository.create(body));
    return this.tenantMapper.toDTO(entity);
  }

  async delete(ctx: IContext, id: string): Promise<{ affected?: number }> {
    return await this.repository.softDelete(id);
  }

  async paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<TenantDto>> {
    const page = await paginate<TenantEntity>(this.repository, query, [
      'tenant',
    ]);
    return {
      items: page.items.map(this.tenantMapper.toDTO),
      meta: page.meta,
    };
  }
}
