import { Controller, Inject } from "@nestjs/common";
import { ITenantService } from "libs/api/infra-api/src/tenant/tenant.service";
import { CreateTenantRequest, DeleteTenantRequest, DeleteTenantReply, FindTenantByNameRequest, RetrieveTenantRequest, TENANT_SERVICE_NAME, Tenant, TenantServiceController, TenantServiceControllerMethods, UpdateTenantRequest, ListTenantReply, ListTenantRequest } from "proto/stub/tenant/tenant.pb";


@Controller()
@TenantServiceControllerMethods()
export class TenantController implements TenantServiceController {
  constructor(
    @Inject('ITenantService') private readonly tenantService: ITenantService,
  ) {}

  async create(req: CreateTenantRequest) {
    const tenant = await this.tenantService.create({
      name: req.name,
      display_name: req.displayName,
      description: req.description,
      region: req.region,
      environment: req.environment,
      jwt_configuration: JSON.parse(req.jwtConfiguration ?? '{}'),
    }, req)

    return {
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.display_name,
      description: tenant.description,
      region: tenant.region,
      environment: tenant.environment,
      jwtConfiguration: JSON.stringify(tenant.jwt_configuration ?? {}),
    }
  }

  async retrieve(req: RetrieveTenantRequest): Promise<Tenant> {
    const tenant = await this.tenantService.retrieve({}, req.id)
    if (!tenant) return undefined

    return {
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.display_name,
      description: tenant.description,
      region: tenant.region,
      environment: tenant.environment,
      jwtConfiguration: JSON.stringify(tenant.jwt_configuration ?? {}),
    }
  }

  async findByName(req: FindTenantByNameRequest): Promise<Tenant> {
    const tenant = await this.tenantService.findByName({}, req.name)
    if (!tenant) return undefined
 
    return {
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.display_name,
      description: tenant.description,
      region: tenant.region,
      environment: tenant.environment,
      jwtConfiguration: JSON.stringify(tenant.jwt_configuration ?? {}),
    }
  }

  async delete(request: DeleteTenantRequest): Promise<DeleteTenantReply> {
      await this.tenantService.delete({}, request.id)
      return {
        success: true,
      };
  }

  async update(request: UpdateTenantRequest): Promise<Tenant> {
    const { id, jwtConfiguration, flags, changePassword, config, ...data } = request
    const tenant = await this.tenantService.update({}, id, data)
    return {
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.display_name,
      description: tenant.description,
      region: tenant.region,
      environment: tenant.environment,
      jwtConfiguration: JSON.stringify(tenant.jwt_configuration ?? {}),
    }
  }

  async list(request: ListTenantRequest): Promise<ListTenantReply> {
    const { items: _items, meta } = await this.tenantService.paginate({}, {
      ...request,
    })

    const items = _items.map(it => ({
      id: it.id,
      name: it.name,
      displayName: it.display_name,
      description: it.description,
      region: it.region,
      environment: it.environment,
      jwtConfiguration: JSON.stringify(it.jwt_configuration ?? {}),
    }))

    return {
      meta: {
        pageSize: meta.page_size,
        page: meta.page,
        total: meta.total,
      },
      items: items,
    }
  }
}