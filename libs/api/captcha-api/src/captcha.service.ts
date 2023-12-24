import { ICaptchaResult } from './captcha-result';

export interface ICaptchaService {
  verify(req: ICaptchaResult): Promise<boolean>;
}
