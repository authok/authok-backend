import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { IClientService } from 'libs/api/infra-api/src';
import * as _ from 'lodash';
import { mapConnection } from './connection.mapper';

@Controller('client')
export class ClientController {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {}

  @Get(':id.js')
  async jsonp(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const client = await this.clientService.retrieve(ctx, id);
    if (!client) throw new NotFoundException('Client not found');

    const connections = await this.clientService.findEnabledConnections(
      ctx,
      client.client_id,
    );

    const strategy2connections = _.groupBy(connections, 'strategy');
    // console.log('strategy2conn: ', strategy2conn);

    const strategies = [];
    for (const strategy in strategy2connections) {
      const connections = strategy2connections[strategy];
      strategies.push({
        name: strategy,
        connections: connections.map((conn) => mapConnection(conn)),
      });
    }

    const data = {
      id: client.client_id,
      tenant: client.tenant,
      subscription: 'free',
      authorize: `https://${req.hostname}/authorize`,
      callback: client.redirect_uris ? client.redirect_uris[0] : '',
      hasAllowedOrigins: false,
      strategies,
    };

    res.setHeader('Content-type', 'application/x-javascript; charset=utf-8');
    res.end(`Authok.setClient(${JSON.stringify(data)});`);
  }
}
