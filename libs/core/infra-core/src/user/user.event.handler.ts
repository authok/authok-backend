import { Injectable, Logger, Inject, InternalServerErrorException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ILogService } from 'libs/api/logstream-api/src/log.service';
import { IPService } from 'libs/support/ipservice-support/src/ip.service';
import {
  IConnectionService, 
  IPasswordHistoryRepository,
  IClientService,
  PasswordHistoryModel,
  UserModel,
  UserCreatedEvent, 
  LoginEvent, 
  UserEvents,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';

@Injectable()
export class UserEventHandler {
  constructor(
    @Inject('ILogService')
    private readonly logService: ILogService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IPService')
    private readonly ipService: IPService,
    @Inject('IPasswordHistoryRepository')
    private readonly passwordHistoryRepo: IPasswordHistoryRepository,
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {}

  @OnEvent(UserEvents.Created)
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const user = event.user;

    if (user.email) {
      try {
        // this.notificationManager.sendAccountConfirmationEmail({ tenant: user.tenant }, user.email, user.user_id);
        Logger.log(`发送账户创建确认邮件, user_id: ${user.user_id}, email: ${user.email}`);
      } catch (e) {
        console.error(e);
      }
    }

    if (user.password) {
      console.log('event to 创建用户: ', user);
      const usedPassword: Partial<PasswordHistoryModel> = {        
        user_id: user.user_id,
        used_password: user.password,
      };
  
      await this.passwordHistoryRepo.create({ tenant: user.tenant }, usedPassword);  
    }
    // TODO 记录用户创建成功的 log event
  }

  @OnEvent(UserEvents.PasswordChanged)
  async handlePasswordChanged(ctx: IContext, user: UserModel) {
    console.log('handlePasswordChanged: ', user);
    await this.passwordHistoryRepo.create(ctx, {        
      user_id: user.user_id,
      used_password: user.password,
    });
  }

  @OnEvent(UserEvents.Logined)
  async handleUserLogin(event: LoginEvent) {
    const connection = await this.connectionService.findByName({ tenant: event.tenant }, event.connection);
    if (!connection) {
      throw new InternalServerErrorException(`connection ${event.connection} not found`,);
    }
    
    const client = await this.clientService.retrieve({ tenant: event.tenant }, event.client_id);
    if (!client) {
      throw new InternalServerErrorException('client not found',);
    }
     
    const location_info = await this.ipService.fetch(event.ip);

    this.logService.log(
      { tenant: event.tenant }, 
      {
        client_id: event.client_id,
        client_name: client.display_name || client.name,
        ip: event.ip,
        strategy_type: 'social',  
        hostname: event.hostname,
        tenant: event.tenant,
        user_id: event.user_id,
        user_name: event.user_name,
        audience: event.audience,
        scope: event.scope,
        strategy: connection?.strategy,
        user_agent: event.user_agent,
        is_mobile: false, // 通过 user_agent 判断
        details: {
        },
        location_info,
        type: 'login',
        connection: event.connection,
        connection_id: connection?.id,
      });
  }
}
