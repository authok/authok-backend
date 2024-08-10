import { Resolver } from '@nestjs/graphql';
import {
  NodeFieldResolver,
  NodeInterface,
  ResolvedGlobalId,
} from 'nestjs-relay';
import { IClientService } from 'libs/api/infra-api/src';
import { Inject } from '@nestjs/common';

@Resolver(NodeInterface)
export class NodeResolver extends NodeFieldResolver {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {
    super();
  }

  resolveNode(resolvedGlobalId: ResolvedGlobalId) {
    const ctx = {}; // TODO

    switch (resolvedGlobalId.type) {
      case 'Application': {
        const client = this.clientService.retrieve(
          ctx,
          resolvedGlobalId.toString(),
        );

        // return application ? new Application() : null;
        return null;
      }
      default:
        return null;
    }
  }
}
