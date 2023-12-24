export const SOCIAL_STRATEGIES = [
  'oauth2',
  'wechat',
  'wechat:pc',
  'wechat:webpage-authorization',
  'wechat:miniprogram:default',
  'wechat:mobile',
  'wechat:miniprogram:app-launch',
  'wechat:miniprogram:qrconnect',
  'wechat:mp:qrconnect',
  'wework:qrcode',
  'tiktok',
  'google',
  'facebook',
  'doudian',
  'douyin',
  'slack',
  'baidu',
  'weibo',
  'apple',
  'alipay',
  'github',
  'qq',
  'telegram',
  'whatsapp',
];

const SOCIAL_STRATEGIES_SET = new Set(SOCIAL_STRATEGIES);

export function isSocialStrategy(strategy) {
  return SOCIAL_STRATEGIES_SET.has(strategy);
}
