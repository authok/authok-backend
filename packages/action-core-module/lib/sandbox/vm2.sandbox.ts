import { Injectable } from '@nestjs/common';
import { NodeVM } from 'vm2';

@Injectable()
export class VM2Sandbox {
  private vm: NodeVM;

  constructor(options?: Record<string, any>) {
    this.vm = new NodeVM({
      timeout: 5000,
      eval: false,
      sandbox: {
        ...options?.sandbox,
      },
      require: {
        external: true,
        builtin: options?.builtin,
        root: './',
        mock: {
          fs: {
          },
        },
      },
    });
  }

  async run<T>(code: string): Promise<T | null> {
    return await this.vm.run(code, 'node_modules') as T;
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    this.vm.on(eventName, listener);
    return this;
  }
}