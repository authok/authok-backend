import { Injectable } from "@nestjs/common";
import { INodeService } from "libs/api/search-api/src/node/node.service";
import { IRequestContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { Node } from "libs/api/search-api/src/node/node";

@Injectable()
export class ElasticSearchNodeService implements INodeService {
  async search<T>(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<Node<T>>> {
    
    return null;
  }
}