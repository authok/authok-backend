import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantEntity } from './tenant.entity';
import {
  TenantModel,
  UpdateTenantModel,
  CreateTenantModel,
  ITenantRepository,
} from 'libs/api/infra-api/src';
import { Repository } from 'typeorm';
import { IContext } from '@libs/nest-core';
import { TenantMapper } from './tenant.mapper';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class TypeOrmTenantRepository implements ITenantRepository {
  @Inject()
  private readonly tenantMapper: TenantMapper;

  constructor(
    @InjectRepository(TenantEntity)
    private readonly repository: Repository<TenantEntity>,
  ) {}

  async retrieve(ctx: IContext, id: string): Promise<TenantModel | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return this.tenantMapper.toDTO(entity);
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<TenantModel | undefined> {
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
    data: UpdateTenantModel,
  ): Promise<TenantModel> {
    await this.repository.update(id, data);
    const entity = await this.repository.findOneOrFail({
      where: { id },
    });
    return this.tenantMapper.toDTO(entity);
  }

  async create(ctx: IContext, body: CreateTenantModel): Promise<TenantModel> {
    const entity = await this.repository.save(this.repository.create(body));
    return this.tenantMapper.toDTO(entity);
  }

  async delete(ctx: IContext, id: string): Promise<{ affected?: number }> {
    return await this.repository.softDelete(id);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TenantModel>> {
    const page = await paginate<TenantEntity>(this.repository, query, [
      'tenant',
    ]);
    return {
      items: page.items.map(this.tenantMapper.toDTO),
      meta: page.meta,
    };
  }
}
