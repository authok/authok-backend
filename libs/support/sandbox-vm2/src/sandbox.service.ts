import { Injectable } from '@nestjs/common';
import { ISandboxService } from 'libs/api/sandbox-api/src/sandbox.service';
import { WrongUsernameOrPasswordError } from 'libs/common/src/exception/exceptions';
import axios from 'axios';
import { NodeVM } from 'vm2';

/**
 * Turn HttpService <Observable<Response<data>> into Promise<data>
 */
@Injectable()
export class VM2SandboxService implements ISandboxService {
  async run<T>(code: string, options?: Record<string, any>): Promise<T | null> {
    const vmState = {
      axios,
      WrongUsernameOrPasswordError,
      ...options?.states,
    };

    const vm = new NodeVM({
      timeout: 5000,
      eval: false,
      sandbox: {
        ...vmState,
      },
      require: {
        external: {
          modules: options?.modules,
          transitive: false,
        },
        builtin: options?.builtin,
        root: './',
        mock: {
          fs: {
            readFileSync() {
              return 'dummy!';
            },
          },
        },
      },
    });

    return vm.run(code, 'node_modules') as T;
  }
}
