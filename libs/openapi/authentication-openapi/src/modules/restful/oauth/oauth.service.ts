import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IdentityDto } from 'libs/dto/src';
import { ISandboxService } from 'libs/api/sandbox-api/src/sandbox.service';
import { 
  IConnectionService,
} from 'libs/api/infra-api/src';
import { ReqCtx, IRequestContext } from '@libs/nest-core';

@Injectable()
export class OAuthService {
  constructor(
    @Inject('ISandboxService')
    private readonly sandboxService: ISandboxService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
  ) {}

  async authResponse(
    @ReqCtx() ctx: IRequestContext,
    connectionId: string,
    state: string,
    authorizationCode: string,
  ): Promise<IdentityDto> {
    /* TODO
    if (!state) {
      return errorIdentityProviderLogin(
        Messages.IDENTITY_PROVIDER_MISSING_STATE_ERROR,
      );
    }
    */
    // TODO 校验 state

    const connection = await this.connectionService.retrieve(ctx, connectionId);

    if (!connection) {
      throw new NotFoundException(
        `connection ${connection.strategy} not found`,
      );
    }

    const codeToTokenFunc: any = await this.sandboxService.run(
      connection.options.codeToTokenFunc,
    );
    const accessToken = await codeToTokenFunc(authorizationCode, connection);

    const fetchIdentityFunc: any = await this.sandboxService.run(
      connection.options.fetchIdentityFunc,
    );
    const identity = await fetchIdentityFunc(accessToken, connection);

    return identity;
  }
}
