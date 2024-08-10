import { Controller, Get, Inject } from "@nestjs/common";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { IUserService } from "libs/api/infra-api/src";
import { UserDto } from "libs/dto/src";
import { ConfigService } from "@nestjs/config";


@Controller('/api/v2/profile')
export class ProfileController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async get(
    @ReqCtx() ctx: IRequestContext,
  ): Promise<UserDto> {
    const tenant = this.configService.get('management.tenant');

    return await this.userService.retrieve({ tenant }, ctx.req.user.sub) as any;
  }
}