import { Module } from "@nestjs/common";
import { ElasticSearchNodeService } from "./node/es.node.service";

@Module({
  providers: [
    {
      provide: 'INodeService',
      useClass: ElasticSearchNodeService,
    }
  ],
  exports: [
    'INodeService',
  ],
})
export class ElasticSearchModule {}