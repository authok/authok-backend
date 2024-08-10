import { Node } from "./node";
import { IRequestContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";

export interface INodeService {
  search<T>(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<Node<T>>>;
}