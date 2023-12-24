import { Controller, Post, Body, Param, Get, UploadedFile, UseInterceptors, Logger } from '@nestjs/common';
import { ActionService, TriggerEvent, TriggerResult } from '@authok/action-core-module';
import * as path from "path";
import { FileInterceptor } from '@nestjs/platform-express';
import * as  multer from 'multer';

@Controller()
export class TriggerController {
  constructor(
    private readonly actionService: ActionService,
  ) {}

  /**
   * 上传代码
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024*1024*100
      },
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const scriptDir = process.env.SCRIPT_PATH || path.join(process.cwd(), 'actions');
          Logger.debug(`目标存储路径: ${scriptDir}`);
          cb(null, scriptDir);
        },
        filename: (req, file, cb) => {
          const { filename } = req.body;
          Logger.debug(`文件名: ${filename}`);
          cb(null, filename || file.originalname);
        },
      }),
    })
  )
  async upload(@UploadedFile() file) {
    console.log('代码上传成功', file.originalname);
    return file.originalname;
  }

  @Post(':trigger/:func?')
  async run(
    @Param('trigger') trigger: string,
    @Param('func') func: string,
    @Body() event: TriggerEvent,
  ): Promise<TriggerResult> {
    return await this.actionService.run(trigger, func, event);
  }

  @Get()
  async status() {
    return 'ok';
  }
}
