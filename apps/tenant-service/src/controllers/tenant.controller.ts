import { Controller, Inject } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ITenantService } from "libs/api/infra-api/src/tenant/tenant.service";
import { CreateTenantRequest, FindTenantByNameRequest, RetrieveTenantRequest, TENANT_SERVICE_NAME, Tenant } from "proto/stub/tenant/tenant.pb";




@Controller()
export class TenantController {
  constructor(
    @Inject('ITenantService') private readonly tenantService: ITenantService,
  ) {}

  @GrpcMethod(TENANT_SERVICE_NAME, 'create')
  async create(req: CreateTenantRequest) {
    console.log('hello')
    const tenant = await this.tenantService.create({}, req)
    
    return tenant as unknown as Tenant; 
  }

  @GrpcMethod(TENANT_SERVICE_NAME, 'retrieve')
  async retrieve(req: RetrieveTenantRequest): Promise<Tenant> {
    const tenant = await this.tenantService.retrieve({}, req.id)
    
    return tenant as unknown as Tenant;
  }

  @GrpcMethod(TENANT_SERVICE_NAME, 'findByName')
  async findByName(req: FindTenantByNameRequest): Promise<Tenant> {
    const tenant = await this.tenantService.findByName({}, req.name)
    
    return tenant as unknown as Tenant;
  }
}