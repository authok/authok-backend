import * as Joi from 'joi';
import { APIException } from 'libs/common/src/exception/api.exception';


export const GoogleCatpchaConfigSchema = Joi.object({
  siteKey: Joi.string().required(),
  secret: Joi.string().required(),
});

export const ReCatpchaCatpchaConfigSchema = Joi.object({
  siteKey: Joi.string().required(),
  apiKey: Joi.string().required(),
  projectId: Joi.string().required(),
});

export const QCloudCatpchaSchema = Joi.object({
  siteKey: Joi.string().required(),
  apiKey: Joi.string().required(),
});

const catpchaProviders = {
  google: GoogleCatpchaConfigSchema,
  reCAPTCHA: ReCatpchaCatpchaConfigSchema,
  qcloud: QCloudCatpchaSchema,
}

const validateCatpchaSchema = <T>(provider: string, options: any): T => {
  if (!options) throw new APIException('invalid_request', '参数不合法, providers对应的配置未设置');

  const providerSchema = catpchaProviders[provider];
  if (!providerSchema) throw new APIException('invalid_request', `参数不合法, 验证码提供者 ${provider} 不存在`);

  const { value, error } = providerSchema.validate(options);
  if (error) throw error;

  return value;
};

export const configValueSchemas = {
  'protection-config': {
    captchas: validateCatpchaSchema,
  }
}

export default function validateConfig<T = any>(namespace: string, name: string, value: any): T {
  if (!namespace) throw new APIException('invalid_request', '参数不合法1');

  if (!value) return value;

  if (!value.provider) return value;

  if (!value.providers) throw new APIException('invalid_request', '参数不合法, 没有providers参数');

  const schemasForNs = configValueSchemas[namespace];
  if (!schemasForNs) throw new APIException('invalid_request', '参数不合法2');

  const schemaValidator = schemasForNs[name];
  if (!schemaValidator) throw new APIException('invalid_request', '参数不合法3');

  const providers = {...value.providers};
  const _options = providers[value.provider];
  if (_options) {
    const options = schemaValidator(value.provider, _options);
    providers[value.provider] = options;
  }

  return { ...value, providers };
}