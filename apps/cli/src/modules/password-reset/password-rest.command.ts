import { Inject, Injectable } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import { IPasswordResetService } from 'libs/api/infra-api/src/password-reset/password-reset.service';
import { PasswordResetDto } from 'libs/api/infra-api/src/password-reset/password-reset.dto';
import { Query } from '@libs/nest-core';

@Injectable()
export class PasswordResetCommand {
  constructor(
    @Inject('IPasswordResetService')
    private readonly passwordResetService: IPasswordResetService,
  ) {}

  @Command({
    command: 'list:password-resets',
    describe: '浏览密码重置条目',
  })
  async list(
    @Option({
      name: 'tenant',
      describe: '租户',
      type: 'string',
      alias: 'tenant',
      required: true
    })
    tenant: string,
  ) {
    const query = { 
      filter: {
        tenant: {
          eq: tenant,
        }
      }
    } as Query<PasswordResetDto>;

    const page = await this.passwordResetService.query({ tenant }, query);
    console.log(page);
  }
}