import { Global, Module } from "@nestjs/common";
import { SAMLPService } from "./services/samlp.service";




@Global()
@Module({
  providers: [
    {
      provide: 'ISAMLPService',
      useClass: SAMLPService,
    }
  ],
  exports: [
    'ISAMLPService'
  ]
})
export class SAMLPModule {}