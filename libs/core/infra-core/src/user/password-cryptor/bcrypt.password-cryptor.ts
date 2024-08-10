import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { SHA1HashUtils } from '../../../../../oidc/common/src/lib/utils/security/sha1hash.util';
import { IPasswordCryptor } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';

@Injectable()
export class BcryptPasswordCryptor implements IPasswordCryptor {
  // 加密
  async encrypt(ctx: IContext, password: string) {
    return await hash(password, SHA1HashUtils.SALT_ROUNDS);
  }

  async compare(
    ctx: IContext,
    plainPassword: string,
    password2: string,
  ): Promise<boolean> {
    // const h = await hash(plainPassword, SHA1HashUtils.SALT_ROUNDS);
    return compare(plainPassword, password2);
  }
}
