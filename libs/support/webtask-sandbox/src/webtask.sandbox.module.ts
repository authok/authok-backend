import { Module } from "@nestjs/common";
import { VM2SandboxModule } from "libs/support/sandbox-vm2/src/vm2.sandbox.module";


@Module({
  imports: [
    VM2SandboxModule,
  ]
})
export class WebtaskSandboxModule {}