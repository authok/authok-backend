import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { 
  EmailTemplateModel,
  IMailer,
} from 'libs/api/infra-api/src';
import { InfraSupportTypeOrmModule } from 'libs/support/infra-support-typeorm/src/infra.support.typeorm.module';
import { NodeMailerMailModule } from 'libs/support/mail-nodemailer/src/mail.module';
import { getConnection } from 'typeorm';
import { EmailTemplateService } from '../email-template/email-template.service';
import { Mailer } from './mailer';

describe('Mailer', () => {
  let mailer: IMailer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [],
        }),
        NodeMailerMailModule,
        InfraSupportTypeOrmModule,
      ],
      providers: [
        {
          provide: 'IMailer',
          useClass: Mailer,
        },
        {
          provide: 'IEmailTemplateService',
          useClass: EmailTemplateService,
        },
      ],
    }).compile();

    mailer = module.get<IMailer>('IMailer');
  });

  afterEach(() => {
    const conn = getConnection('authok');
    return conn.close();
  });

  it('should be defined', () => {
    expect(mailer).toBeDefined();
  });

  it('send verify_mail', async () => {
    const template = {
      template: 'verify_email',
    } as EmailTemplateModel;
    
    await mailer.send(
      { tenant: '23a2131c-8fae-48fa-a72f-5036a8e353f3' },
      template,
      {
        code: '123443'
      },
      '52388483@qq.com',
    );

    console.log('send mail');
  });
});
