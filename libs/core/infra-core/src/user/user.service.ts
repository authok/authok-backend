import { HttpStatus, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { TwoFactorAuthUtils } from '../../../../oidc/common/src/lib/utils/security/twofactorauth.util';
import * as _ from 'lodash';
import {
  IdentityDto,
  LinkIdentityReq,
} from 'libs/api/infra-api/src/identity/identity.dto';
import {
  CreateUserDto,
  PostPermissionsDto,
  UserDto,
  UserPageQueryDto,
} from 'libs/api/infra-api/src/user/user.dto';
import { IUserService } from 'libs/api/infra-api/src/user/user.service';
import { IIdentityRepository } from 'libs/api/infra-api/src/identity/identity.repository';
import { IUserRepository } from 'libs/api/infra-api/src/user/user.repository';
import { IRoleRepository } from 'libs/api/infra-api/src/role/role.repository';
import { IUserRoleRepository } from 'libs/api/infra-api/src/user/user-role.repository';
import { ISecretQuestionRepository } from 'libs/api/infra-api/src/secret-question/secret-question.repository';
import { ISecretAnswerRepository } from 'libs/api/infra-api/src/secret-question/secret-answer.repository';
import { EventEmitter2 } from 'eventemitter2';
import {
  UserCreatedEvent,
  UserEvents,
} from 'libs/api/infra-api/src/user/user.event';
import { UserRoleDto } from 'libs/api/infra-api/src/user/user-role.dto';
import { APIException } from 'libs/common/src/exception/api.exception';
import { IContext } from '@libs/nest-core';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { PostUserRoleDto } from 'libs/api/infra-api/src/role/role.dto';
import { PermissionDto } from 'libs/api/infra-api/src/permission/permission.dto';
import { OrganizationDto } from 'libs/api/infra-api/src/organization/organization.dto';
import { FindOptions } from 'libs/common/src/types';
import { IPasswordCryptor } from 'libs/api/infra-api/src/user/password-cryptor/password-cryptor';
import { IPasswordResetRepository } from 'libs/api/infra-api/src/password-reset/password-reset.repository';
import { IMailer } from 'libs/api/infra-api/src/email-template/mailer.service';
import { IPService } from 'libs/support/ipservice-support/src/ip.service';
import dayjs from 'dayjs';
import { v4 as guid } from 'uuid';
import { IEmailTemplateRepository } from 'libs/api/infra-api/src/email-template/email-template.repository';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IIdentityRepository')
    private readonly identityRepo: IIdentityRepository,
    @Inject('IRoleRepository')
    private readonly roleRepo: IRoleRepository,
    @Inject('IUserRoleRepository')
    private readonly userRoleRepo: IUserRoleRepository,
    @Inject('ISecretQuestionRepository')
    private readonly questionRepo: ISecretQuestionRepository,
    @Inject('ISecretAnswerRepository')
    private readonly answerRepo: ISecretAnswerRepository,
    @Inject('IPasswordResetRepository')
    private readonly passwordResetRepo: IPasswordResetRepository,
    private readonly eventEmitter: EventEmitter2,
    @Inject('IPasswordCryptor')
    private readonly passwordCryptor: IPasswordCryptor,
    @Inject('IMailer')
    private readonly mailer: IMailer,
    @Inject('IPService')
    private readonly ipService: IPService,

    @Inject('IEmailTemplateRepository')
    private readonly emailTemplateRepository: IEmailTemplateRepository,
  ) {}
  async retrieve(ctx: IContext, user_id: string): Promise<UserDto | undefined> {
    return await this.userRepo.retrieve(ctx, user_id);
  }

  public async create(
    ctx: IContext,
    user: CreateUserDto,
  ): Promise<UserDto | undefined> {
    if (user.username) {
      const existingUser = await this.userRepo.findByUsername(
        ctx,
        user.connection,
        user.username,
        {
          select: ['user_id', 'username'],
        },
      );

      if (existingUser) {
        Logger.warn(`重复注册，用户已经存在, username: ${user.username}`);
        throw new APIException(
          'invalid request',
          '有相同用户名的用户已经存在',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (user.email) {
      const existingUser = await this.userRepo.findByEmail(
        ctx,
        user.connection,
        user.email,
        {
          select: ['user_id', 'email'],
        },
      );

      if (existingUser) {
        Logger.warn(`重复注册，用户已经存在, email: ${user.email}`);
        throw new APIException(
          'invalid request',
          '有相同邮箱的用户已经存在',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (user.phone_number) {
      const existingUser = await this.userRepo.findByPhoneNumber(
        ctx,
        user.connection,
        user.phone_number,
        {
          select: ['user_id', 'phone_number'],
        },
      );

      if (existingUser) {
        Logger.warn(
          `重复注册，用户已经存在, phone_numer: ${user.phone_number}`,
        );
        throw new APIException(
          'invalid request',
          '有相同手机号的用户已经存在',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const _user = { ...user };
    if (user.password) {
      _user.password = await this.passwordCryptor.encrypt(ctx, _user.password);
    }

    const newUser = await this.userRepo.create(ctx, _user);

    // 发送事件
    this.eventEmitter.emit(UserEvents.Created, {
      user: newUser,
    } as UserCreatedEvent);

    const _newUser = _.omit(newUser, 'password');

    return _newUser;
  }

  /**
   * Function used to update the "email_verified" attribute to true
   */
  public async userVerifiedEmail(ctx: IContext, id: string): Promise<void> {
    await this.userRepo.update(ctx, id, {
      email_verified: true,
    });
  }

  public async validateUser(
    ctx: IContext,
    user: UserDto,
    password: string,
  ): Promise<boolean> {
    return await this.passwordCryptor.compare(ctx, password, user.password);
  }

  /**
   * Function used to set "enabled2fa" to true and generate a new 2fa secret for a user; saves the result
   */
  public async enable2fa(ctx: IContext, user_id: string) {
    const user = await this.userRepo.retrieve(ctx, user_id);
    if (user && user.enabled2fa === false) {
      const newSecret = TwoFactorAuthUtils.generateNewSecret();
      await this.userRepo.update(ctx, user_id, {
        enabled2fa: true,
        secret2fa: newSecret,
      });
    }
  }

  /**
   * Function used to set "enabled2fa" to false and remove "secret2fa"
   */
  public async disable2fa(ctx: IContext, userId: string) {
    const user = await this.userRepo.retrieve(ctx, userId);

    if (user && user.enabled2fa) {
      return await this.userRepo.update(ctx, userId, {
        enabled2fa: false,
        secret2fa: null, // TODO 这里 null 应该不生效，估计要设置为 ''
      });
    }
  }

  /*
  async areSecretAnswersCorrect(
    ctx: IContext,
    user_id: string,
    answers: { answer: string; question: string }[],
  ): Promise<boolean> {
    const user = await this.userRepo.retrieve(ctx, user_id);

    const secretAnswers = await this.answerRepo.findByUser(ctx, user.user_id);

    let isCorrect = false;

    const questionToAnswer = _.keyBy(answers, 'question');

    for (let i = 0; i < secretAnswers.length; i++) {
      const secretAnswer = secretAnswers[i];

      const answer = questionToAnswer[secretAnswer.secretQuestion.id];
      if (!answer) {
        isCorrect = false;
        break;
      }

      isCorrect = compare(answer, secretAnswer.answer);
      if (!answer) {
        isCorrect = false;
        break;
      }
    }

    return isCorrect;
  }
  */

  async findByGuid(ctx, guid: string) {
    return await this.userRepo.findByGuid(ctx, guid);
  }

  async findByEmail(
    ctx: IContext,
    connection: string,
    email: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined> {
    return this.userRepo.findByEmail(ctx, connection, email, options);
  }

  async findByPhoneNumber(
    ctx: IContext,
    connection: string,
    phone_number: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined> {
    return await this.userRepo.findByPhoneNumber(
      ctx,
      connection,
      phone_number,
      options,
    );
  }

  async findByUsername(
    ctx: IContext,
    connection: string,
    username: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined> {
    return await this.userRepo.findByUsername(
      ctx,
      connection,
      username,
      options,
    );
  }

  async updateFederatedIdentity(
    ctx: IContext,
    identity: IdentityDto,
  ): Promise<IdentityDto> {
    const { affected } = await this.identityRepo.update(ctx, identity);
    if (!affected) {
      throw new NotFoundException(`FederatedIentity id: ${identity} not found`);
    }
    return await this.identityRepo.retrieve(ctx, identity.id);
  }

  async update(
    ctx: IContext,
    user_id: string,
    _data: Partial<UserDto>,
  ): Promise<UserDto> {
    const data = { ..._data };
    // 构造密码
    if (_data.password) {
      data.password = await this.passwordCryptor.encrypt(ctx, _data.password);
      Logger.log('update password: ', _data.password, data.password);
    }

    const user = await this.userRepo.update(ctx, user_id, data);

    if (_data.password) {
      this.eventEmitter.emit(UserEvents.PasswordChanged, ctx, {
        ...data,
        user_id,
      });
    }

    return user;
  }

  async delete(ctx: IContext, user_id: string): Promise<void> {
    await this.userRepo.delete(ctx, user_id);
  }

  async paginate(
    ctx: IContext,
    query: UserPageQueryDto,
  ): Promise<PageDto<UserDto>> {
    return await this.userRepo.paginate(ctx, query);
  }

  async addFederatedIdentity(
    ctx: IContext,
    user_id: string,
    identity: IdentityDto,
  ): Promise<IdentityDto> {
    // TODO
    return null;
  }

  async removeFederatedIdentity(
    ctx: IContext,
    user_id: string,
    provider: string,
  ): Promise<void> {
    // TODO
    return null;
  }

  async findByConnection(
    ctx: IContext,
    connection: string,
    user_id: string, // identity 的 userId
  ): Promise<UserDto | undefined> {
    return this.userRepo.findByConnection(ctx, connection, user_id);
  }

  async findByIdentityProvider(
    ctx: IContext,
    provider: string,
    user_id: string,
  ): Promise<UserDto | undefined> {
    return this.userRepo.findByIdentityProvider(ctx, provider, user_id);
  }

  async assignPermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissionsDto,
  ): Promise<void> {
    await this.userRepo.assignPermissions(ctx, user_id, body);
  }

  async removePermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissionsDto,
  ): Promise<void> {
    return await this.userRepo.removePermissions(ctx, user_id, body);
  }

  async addRolesToUser(
    ctx: IContext,
    user_id: string,
    body: PostUserRoleDto,
  ): Promise<void> {
    const user = await this.userRepo.retrieve(ctx, user_id);
    if (!user) throw new NotFoundException(`User id: ${user_id} not found`);

    const roles = await this.roleRepo.findByIds(ctx, body.roles);
    const userRoles: Partial<UserRoleDto>[] = roles.map((it) => ({
      role_id: it.id,
      user_id,
    }));

    await this.userRoleRepo.batchCreate(ctx, userRoles);
  }

  async removeRolesToUser(
    ctx: IContext,
    user_id: string,
    body: PostUserRoleDto,
  ): Promise<void> {
    const user = await this.userRepo.retrieve(ctx, user_id);
    if (!user) throw new NotFoundException(`User id: ${user_id} not found`);

    const userRoles: Partial<UserRoleDto>[] = body.roles?.map((it) => ({
      role_id: it,
      user_id,
    }));

    await this.userRoleRepo.batchDelete(ctx, userRoles);
  }

  async paginatePermissions(
    ctx: IContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<PermissionDto>> {
    return await this.userRepo.paginatePermissions(ctx, user_id, query);
  }

  async updateGroupsToUser(
    ctx: IContext,
    user_id: string,
    group_ids: string[],
    overwrite = false,
  ): Promise<void> {
    await this.userRepo.updateGroupsToUser(ctx, user_id, group_ids, overwrite);
  }

  async linkIdentity(
    ctx: IContext,
    primaryUserId: string,
    linkIdentityReq: LinkIdentityReq,
  ): Promise<IdentityDto[]> {
    return await this.userRepo.linkIdentity(
      ctx,
      primaryUserId,
      linkIdentityReq,
    );
  }

  async unlinkIdentity(
    ctx: IContext,
    primaryUserId: string,
    connection: string,
    secondaryUserId: string,
  ): Promise<IdentityDto[]> {
    return await this.userRepo.unlinkIdentity(
      ctx,
      primaryUserId,
      connection,
      secondaryUserId,
    );
  }

  async listOrganizations(
    ctx: IContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>> {
    return await this.userRepo.listOrganizations(ctx, user_id, query);
  }

  async listRoles(
    ctx: IContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<UserRoleDto>> {
    return await this.userRoleRepo.paginate(ctx, { ...query, user_id });
  }

  async startResetPasswordByEmail(
    ctx: IContext,
    connection: string,
    email: string,
    ip: string,
  ): Promise<void> {
    const user = await this.userRepo.findByEmail(ctx, connection, email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const now = new Date();
    const resetReq = await this.passwordResetRepo.createOne(ctx, {
      user_id: user.user_id,
      initializer_ip: ip,
      token: guid(),
      created_at: now,
      expires_at: dayjs(now).add(30, 'minute').toDate(),
    });

    const result = await this.ipService.fetch(ip);
    const location = result.country_name;

    const url =
      'https://' +
      user.tenant +
      '.' +
      'authok.cn' +
      '/lo/reset?ticket=' +
      resetReq.token;

    const emailTemplate = await this.emailTemplateRepository.findByName(
      ctx,
      'reset_email',
    );
    if (!emailTemplate) {
      throw new APIException('invalid_request', '邮件模版不存在');
    }

    await this.mailer.send(
      ctx,
      emailTemplate,
      {
        url,
      },
      email,
    );
  }
}
