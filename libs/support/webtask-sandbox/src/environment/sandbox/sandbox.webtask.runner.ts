import { Inject, Injectable } from '@nestjs/common';
import { IContext } from 'libs/shared/src/context';
import { IWebTaskRunner, WebTaskConfig, WebTaskInstance } from '../../webtask';
import { ISandboxService } from 'libs/api/sandbox-api/src/sandbox.service';

@Injectable()
export class SandboxWebTaskRunner implements IWebTaskRunner {
  constructor(
    @Inject('ISandboxService') private readonly sandboxService: ISandboxService,
  ) {}

  run(context: IContext, taskConfig: WebTaskConfig): Promise<WebTaskInstance> {
    this.sandboxService.run(code);

    return null;
  }
}
