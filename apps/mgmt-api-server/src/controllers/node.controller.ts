import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { NodeDto, NodePageQueryDto } from "../dto/node.dto";
import { INodeService } from "libs/api/search-api/src/node/node.service";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { TenantGuard } from "../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";

@Controller('/api/v2/nodes')
@UseGuards(TenantGuard)
export class NodeController {
  constructor(
    @Inject('INodeService') private readonly nodeService: INodeService,
  ) {}

  @Get('search')
  search(@ReqCtx() ctx: IRequestContext, query: NodePageQueryDto): Promise<PageDto<NodeDto<any>>> {
    return this.nodeService.search(ctx, query);
  }
}