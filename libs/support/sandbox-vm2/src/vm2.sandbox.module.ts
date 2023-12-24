import { Global, Module } from '@nestjs/common';
import { VM2SandboxService } from './sandbox.service';

@Global()
@Module({
  providers: [
    {
      provide: 'ISandboxService',
      useClass: VM2SandboxService,
    },
  ],
  exports: ['ISandboxService'],
})
export class VM2SandboxModule {}
