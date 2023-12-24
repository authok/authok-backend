import { Controller, Get, Inject } from "@nestjs/common";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { IUserService } from "libs/api/infra-api/src/user/user.service";
import { UserDto } from "libs/api/infra-api/src/user/user.dto";
import { ConfigService } from "@nestjs/config";


@Controller('/api/v1/profile')
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

    return await this.userService.retrieve({ tenant }, ctx.req.user.sub);
  }
}