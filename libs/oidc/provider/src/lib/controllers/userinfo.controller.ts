import {
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
  Options,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserDto } from 'libs/dto/src/user/user.dto';
import { Request, Response } from 'express';
import { IRequestContext, ReqCtx } from '@libs/nest-core';

@ApiTags('用户档案')
@Controller('userinfo')
export class UserinfoController {
  @Get()
  @ApiOperation({ description: '根据ID查找用户' })
  @ApiOkResponse({
    type: UserDto,
  })
  async userinfo(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('tenant not found');
    }

    const callback = provider.callback();
    return await callback(req, res);
  }

  @Options()
  async userinfoOptions() {}
}
