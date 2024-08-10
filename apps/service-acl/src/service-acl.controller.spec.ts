import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAclController } from './service-acl.controller';
import { ServiceAclService } from './service-acl.service';

describe('ServiceAclController', () => {
  let serviceAclController: ServiceAclController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceAclController],
      providers: [ServiceAclService],
    }).compile();

    serviceAclController = app.get<ServiceAclController>(ServiceAclController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceAclController.getHello()).toBe('Hello World!');
    });
  });
});
