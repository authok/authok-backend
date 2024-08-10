import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Req,
  Res,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ISAMLPService } from 'libs/samlp/src/interface';
import * as samlify from 'samlify';
import { Request, Response } from 'express';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { 
  IClientService,
  IUserService,
  UserModel,
} from 'libs/api/infra-api/src';
import * as https from 'https';
import * as uuid from 'uuid';

import { URL } from 'url';
import * as validator from '@authenio/samlify-xsd-schema-validator';
samlify.setSchemaValidator(validator);
/*
samlify.setSchemaValidator({
  validate: (response) => {
    return Promise.resolve('skipped');
  }
});
*/

const createTemplateCallback =
  (
    idp: samlify.IdentityProviderInstance,
    sp: samlify.ServiceProviderInstance,
    user: UserModel,
    samlpConfig: Record<string, any>,
  ) =>
  (template) => {
    const _id = '_8e8dc5f69a98cc4c1ff3427e5ce34606fd672f91e6';
    const now = new Date();
    const spEntityID = sp.entityMeta.getEntityID();
    const idpSetting = idp.entitySetting;
    const fiveMinutesLater = new Date(now.getTime());
    fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 5);
    const sessionExpireTime = new Date(now.getTime());
    sessionExpireTime.setSeconds(sessionExpireTime.getDate() + 1);
    const tvalue = {
      ID: _id,
      AssertionID: idpSetting.generateID
        ? idpSetting.generateID()
        : `${uuid.v4()}`,
      Destination: samlpConfig.consumer, // sp.entityMeta.getAssertionConsumerService(samlify.Constants.namespace.binding.post),
      Audience: spEntityID,
      SubjectRecipient: spEntityID,
      NameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      NameID: user.email,
      Issuer: idp.entityMeta.getEntityID(),
      IssueInstant: now.toISOString(),
      ConditionsNotBefore: now.toISOString(),
      ConditionsNotOnOrAfter: fiveMinutesLater.toISOString(),
      SubjectConfirmationDataNotOnOrAfter: fiveMinutesLater.toISOString(),
      AssertionConsumerServiceURL: samlpConfig.consumer, // sp.entityMeta.getAssertionConsumerService(samlify.Constants.namespace.binding.post),
      EntityID: spEntityID,
      InResponseTo: '_4606cc1f427fa981e6ffd653ee8d6972fc5ce398c4',
      AuthnStatement: `<saml:AuthnStatement AuthnInstant="${now.toISOString()}" SessionNotOnOrAfter="${sessionExpireTime.toISOString()}" SessionIndex="123"><saml:AuthnContext><saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified</saml:AuthnContextClassRef></saml:AuthnContext></saml:AuthnStatement>`,
      StatusCode: 'urn:oasis:names:tc:SAML:2.0:status:Success',
    };

    samlpConfig.attributes.forEach((attr, i) => {
      tvalue[`attr${i}`] = attr.value;
    });

    // console.log('xxfuck: ', samlify.SamlLib.replaceTagsByValue(template, tvalue));

    return {
      id: _id,
      context: samlify.SamlLib.replaceTagsByValue(template, tvalue),
    };
  };

@ApiTags('SAML')
@Controller('/samlp')
export class SAMLPController {
  constructor(
    @Inject('ISAMLPService')
    private readonly samlpService: ISAMLPService,
    @Inject('IClientService')
    private readonly clientService: IClientService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Get('resume')
  async resume(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { SessionNotFound } = await import('@authok/oidc-provider/lib/helpers/errors');


    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('provider not found');
    }

    // 通过 state 找到 interaction
    // req.query.state;
    const c = provider.app.createContext(req, res);
    const interaction = await provider.Interaction.find(c, req.query.state);
    if (!interaction) {
      throw new SessionNotFound('interaction session not found');
    }
    console.log('interaction: ', interaction, interaction.uid);

    const { client_id, protocol } = interaction.params;

    const client = await this.clientService.retrieve(ctx, client_id);
    if (!client) {
      throw new NotFoundException(`client ${client_id} not found`);
    }

    const samlp = client.addons?.samlp;
    if (!samlp) {
      throw new NotFoundException(`client addon samlp not found`);
    }

    const idp = (await this.samlpService.findIdp(
      ctx,
      client_id,
    )) as samlify.IdentityProviderInstance;
    if (!idp) {
      throw new NotFoundException(
        `SAMLP idp ${ctx.tenant} for client: ${client_id} not found`,
      );
    }

    const assertionConsumerServiceUrl = client.redirect_uris[0];

    // TODO  这里是否要删除 interaction

    const sp = await this.samlpService.findSp(ctx, client_id);

    const user = {
      user_id: 'u1',
      email: '1@gmail.com',
    } as UserModel;

    // create login response after login, post sp callback url
    const sampleRequestInfo = { extract: { request: { id: 'request_id' } } };

    const { context } = await idp.createLoginResponse(
      sp,
      sampleRequestInfo,
      'post',
      {},
      createTemplateCallback(idp, sp, user, samlp),
    );
    console.log('samlpRes: ', context);

    const formHTML = `<html>
  <head>
    <title>Running...</title>
  </head>
  <body>
    <form method="post" name="hiddenform" action="${assertionConsumerServiceUrl}">
      <input type="hidden" name="SAMLResponse" value="${context}">
      <input type="hidden" name="RelayState" value="">
      <noscript> <p> Script is disabled. Click Submit to continue. </p><input type="submit" value="Submit"> </noscript>
    </form>
    <script language="javascript" type="text/javascript"> window.setTimeout(function(){document.forms[0].submit();}, 0);</script>
  </body>
</html>`;

    res.send(formHTML);
  }

  @Post(':client_id/login_response')
  async loginResponse(
    @ReqCtx() ctx: IRequestContext,
    @Param('client_id') client_id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const client = await this.clientService.retrieve(ctx, client_id);
    if (!client) {
      throw new NotFoundException(`client ${client_id} not found`);
    }

    const samlp = client.addons?.samlp;
    if (!samlp) {
      throw new NotFoundException(`client addon samlp not found`);
    }

    const idp = (await this.samlpService.findIdp(
      ctx,
      client_id,
    )) as samlify.IdentityProviderInstance;
    if (!idp) {
      throw new NotFoundException(
        `SAMLP idp ${ctx.tenant} for client: ${client_id} not found`,
      );
    }

    const sp = await this.samlpService.findSp(ctx, client_id);

    const loginResp = await sp.parseLoginResponse(idp, 'post', req);

    console.log('loginResp: ', loginResp);

    res.send('ok');
  }

  @Get('/:client_id')
  @ApiOperation({ summary: '初始化登录' })
  async get(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Param('client_id') client_id: string,
    @Query('connection') connection: string,
    @Query('organization') organization: string,
    @Body() body: any,
  ) {
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('provider not found');
    }

    const client = await this.clientService.retrieve(ctx, client_id);
    if (!client) {
      throw new NotFoundException(`client ${client_id} not found`);
    }

    const samlp = client.addons?.samlp;
    if (!samlp) {
      throw new NotFoundException(`client addon samlp not found`);
    }

    const idp = (await this.samlpService.findIdp(
      ctx,
      client_id,
    )) as samlify.IdentityProviderInstance;
    if (!idp) {
      throw new NotFoundException(
        `SAMLP idp ${ctx.tenant} for client: ${client_id} not found`,
      );
    }

    const assertionConsumerServiceUrl = client.redirect_uris[0];

    const c = provider.app.createContext(req, res);
    const session = await provider.Session.get(c);
    console.log('sessionxxx: ', session.accountId);

    // 已经登录
    if (session.accountId) {
      const user = await this.userService.retrieve(ctx, session.accountId);
      if (!user) {
        throw new NotFoundException(`user ${session.accountId} not found`);
      }

      const sp = await this.samlpService.findSp(ctx, client_id);

      const sampleRequestInfo = { extract: { request: { id: 'request_id' } } };
      const samlpRes = await idp.createLoginResponse(
        sp,
        sampleRequestInfo,
        'post',
        {},
        createTemplateCallback(idp, sp, user, samlp),
      );

      // 这里吐一个form
      const formHTML = `<html>
        <head>
          <title>Running...</title>
        </head>
        <body>
          <form method="post" name="hiddenform" action="${assertionConsumerServiceUrl}">
            <input type="hidden" name="SAMLResponse" value="${samlpRes.context}">
            <input type="hidden" name="RelayState" value="">
            <noscript> <p> Script is disabled. Click Submit to continue. </p><input type="submit" value="Submit"> </noscript>
          </form>
          <script language="javascript" type="text/javascript"> window.setTimeout(function(){document.forms[0].submit();}, 0);</script>
        </body>
      </html>`;

      res.send(formHTML);

      console.log('已登录，直接发送 SamlResponse');

      return;
    }

    // 没有登录, 跳转到 authorize 端点

    const authorizeURL = new URL(`https://${req.hostname}/authorize`);
    authorizeURL.searchParams.set('client_id', client_id);
    authorizeURL.searchParams.set('response_type', 'code');
    authorizeURL.searchParams.set('scope', 'profile mail openid');
    authorizeURL.searchParams.set('redirect_uri', assertionConsumerServiceUrl);
    authorizeURL.searchParams.set('protocol', 'samlp');
    !!organization &&
      authorizeURL.searchParams.set('organization', organization);
    !!connection && authorizeURL.searchParams.set('connection', connection);

    const forwardRequest = https.request(
      authorizeURL.href,
      {
        method: 'GET',
        headers: req.headers,
      },
      async (forwardResponse) => {
        console.log(
          `Got response from ${authorizeURL.href}`,
          forwardResponse.headers,
        );
        res.writeHead(forwardResponse.statusCode!, forwardResponse.headers);
        forwardResponse.pipe(res);
      },
    );

    req.pipe(forwardRequest);
  }

  @Post('/:client_id')
  @ApiOperation({ summary: 'SP初始化登录' })
  async spLoginRequest(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Param('client_id') client_id: string,
    @Query('connection') connection: string,
    @Query('organization') organization: string,
  ) {
    const client = await this.clientService.retrieve(ctx, client_id);
    if (!client) {
      throw new NotFoundException(`client ${client_id} not found`);
    }

    const samlp = client.addons?.samlp;
    if (!samlp) {
      throw new NotFoundException(`client addon samlp not found`);
    }

    const idp = (await this.samlpService.findIdp(
      ctx,
      client_id,
    )) as samlify.IdentityProviderInstance;
    if (!idp) {
      throw new NotFoundException(
        `SAMLP idp ${ctx.tenant} for client: ${client_id} not found`,
      );
    }

    const sp = await this.samlpService.findSp(ctx, client_id);

    const parseResult = await idp.parseLoginRequest(sp, 'post', req);
    const { id, assertionConsumerServiceUrl, issueInstant, destination } =
      parseResult.extract.request;

    const user = {
      user_id: 'u1',
      email: '1@gmail.com',
    } as UserModel;

    const samlpRes = await idp.createLoginResponse(
      sp,
      parseResult,
      'post',
      {},
      createTemplateCallback(idp, sp, user, samlp),
    );
    console.log('samlpResxx_post: ', samlpRes);

    // 这里吐一个form
    const formHTML = `<html>
      <head>
        <title>Running...</title>
      </head>
      <body>
        <form method="post" name="hiddenform" action="${assertionConsumerServiceUrl}">
          <input type="hidden" name="SAMLResponse" value="${samlpRes.context}">
          <input type="hidden" name="RelayState" value="">
          <noscript> <p> Script is disabled. Click Submit to continue. </p><input type="submit" value="Submit"> </noscript>
        </form>
        <script language="javascript" type="text/javascript"> window.setTimeout(function(){document.forms[0].submit();}, 0);</script>
      </body>
    </html>`;

    res.send(formHTML);

    /*
    const authorizeURL = `https://${req.hostname}/authorize?client_id=${client_id}&response_type=code&scope=profile email openid&redirect_uri=${assertionConsumerServiceUrl}&protocol=samlp`;
    const forwardRequest = https.request(
      authorizeURL,
      {
          method: 'GET',
          headers: req.headers,
      }, 
      async forwardResponse => {
        const location = forwardResponse.headers.location;
        console.log('xxlocation: ', location);
        if (!!location && location.startsWith(assertionConsumerServiceUrl)) {
          // 要响应请求了
          
          const sp = await this.samlpService.findSp(ctx, client_id);
      
          const user = {
            user_id: 'u1',
            email: '1@gmail.com',
          } as UserModel;
      
          const samlpRes = await idp.createLoginResponse(
            sp,
            parseResult, 
            'post', 
            {},
            createTemplateCallback(idp, sp, user, samlp),
          );
          console.log('samlpResxx_get: ', samlpRes);
      
          // 这里吐一个form
          const formHTML = `<html>
            <head>
              <title>Running...</title>
            </head>
            <body>
              <form method="post" name="hiddenform" action="${assertionConsumerServiceUrl}">
                <input type="hidden" name="SAMLResponse" value="${samlpRes.context}">
                <input type="hidden" name="RelayState" value="">
                <noscript> <p> Script is disabled. Click Submit to continue. </p><input type="submit" value="Submit"> </noscript>
              </form>
              <script language="javascript" type="text/javascript"> window.setTimeout(function(){document.forms[0].submit();}, 0);</script>
            </body>
          </html>`;

          res.send(formHTML);
          return;
        }

        console.log(`Got response from ${authorizeURL}`, forwardResponse.headers);
        res.writeHead(forwardResponse.statusCode!, forwardResponse.headers);
        forwardResponse.pipe(res);
      }
    );

    req.pipe(forwardRequest);
    */
  }

  @Get('metadata/:client_id')
  async getMetadata(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Param('client_id') client_id: string,
  ) {
    const idp = (await this.samlpService.findIdp(
      ctx,
      client_id,
    )) as samlify.IdentityProviderInstance;
    // TODO
    res.setHeader('content-type', 'application/xml');
    res.send(idp.getMetadata());
  }

  @Get('/metadata')
  async getMetadataByConnection(
    @Query('connection') connection: string,
  ): Promise<unknown | undefined> {
    // TODO
    return null;
  }
}
