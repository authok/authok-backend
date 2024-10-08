import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response } from 'express';

import { urlFragment, urlHas } from '../../utils/web/url-utils';
import { 
  IUserService,
  ISecretQuestionService,
} from 'libs/api/infra-api/src';

@Injectable()
export class UserValidationMiddleware implements NestMiddleware {
  constructor(
    @Inject('IUserService')
    public readonly userService: IUserService,
    @Inject('ISecretQuestionService')
    public readonly questionService: ISecretQuestionService,
  ) {}
  public async use(req: Request, res: Response, next: () => void) {
    const tenant = req.subdomains[req.subdomains.length - 1];
    try {
      req.body.validationErrors = [];
      const { confirm_password, password, email } = req.body;

      const existingUser = await this.userService.findByEmail(
        { tenant },
        null,
        email,
      );

      const greaterThan8 = new RegExp(/\S{8,}/, 'g');
      const atleastOneLowerCase = new RegExp(/[a-z]{1,}/, 'g');
      const atleastOneUpperCase = new RegExp(/[A-Z]{1,}/, 'g');
      const atleastOneNumber = new RegExp(/\d{1,}/, 'g');
      const atleastOneSpecialChar = new RegExp(/[!@#$%^&*]{1,}/, 'g');

      const isGreaterThan8 = greaterThan8.test(password);
      const hasAtleastOneLowerCase = atleastOneLowerCase.test(password);
      const hasAtleastOneUpperCase = atleastOneUpperCase.test(password);
      const hasAtleastOneNumber = atleastOneNumber.test(password);
      const hasAtleastOneSpecialChar = atleastOneSpecialChar.test(password);

      if (!isGreaterThan8) {
        req.body.validationErrors.push(
          'Password must be greater than or equal to 8 chars in length\n',
        );
      }
      if (!hasAtleastOneLowerCase) {
        req.body.validationErrors.push(
          'Password must contain at least one lowercase character\n',
        );
      }
      if (!hasAtleastOneUpperCase) {
        req.body.validationErrors.push(
          'Password must contain at least one uppercase character\n',
        );
      }
      if (!hasAtleastOneNumber) {
        req.body.validationErrors.push(
          'Password must contain at least one numeric character\n',
        );
      }
      if (!hasAtleastOneSpecialChar) {
        req.body.validationErrors.push(
          'Password must contain at least one special [!@#$%^&*] character\n',
        );
      }

      if (existingUser || email.length < 8) {
        req.body.validationErrors.push('Invalid email');
        throw new Error('Invalid email');
      }
      if (confirm_password !== password) {
        req.body.validationErrors.push('Both passwords must be equal');
        throw new Error('Both passwords must be equal');
      }
      if (
        isGreaterThan8 &&
        hasAtleastOneLowerCase &&
        hasAtleastOneUpperCase &&
        hasAtleastOneNumber &&
        hasAtleastOneSpecialChar
      ) {
        next();
      } else {
        throw new Error('Password isnt strong enough');
      }
    } catch (err) {
      const questions = await this.questionService.findAll({ tenant });
      const locals = {
        title: 'SSO单点登录',
        client: {},
        debug: false,
        details: {},
        params: {},
        interaction: true,
        error: true,
        message: req.body.validationErrors,
        questions: questions,
        devMode: urlHas(req.path, 'dev', true),
        requestingHost: urlFragment('', 'hostname'),
      };
      return res.render('register', locals, (err, html) => {
        if (err) throw err;
        res.render('_registration-layout', {
          ...locals,
          body: html,
        });
      });
    }
  }
}
