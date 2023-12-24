import { Controller, Get, Res, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// import { AuthenticationClient } from "@authok/authok-node";
import { URL } from 'url';
import { Response } from "express";

@Controller('login')
export class LoginController {
  constructor(
    private readonly configService: ConfigService,
  ) {}
  
  // 这个主要用于应对 WEB 应用, SPA应用直接给到SPA的登录页面地址即可
  @Get()
  login(
    @Res() res: Response,
    @Query('invitation') invitation: string,
    @Query('organization') organization: string,
    @Query('organization_name') organization_name: string,
  ) {
    const domain = this.configService.get('management.domain');
    const clientId = this.configService.get('management.client_id');
  
    const url = new URL(`https://${domain}/authorize`);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('redirect_uri', 'http://localhost:8000/login');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('response_mode', 'query');

    if (invitation) {
      url.searchParams.set('invitation', invitation);
    }

    if (organization) {
      url.searchParams.set('organization', organization);
    }

    if (organization_name) {
      url.searchParams.set('organization_name', organization_name);
    }

    res.redirect(url.href);
  }
}