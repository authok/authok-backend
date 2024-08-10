import { ConnectionDto } from "libs/dto/src";

const mappers = {};

mappers['authok'] = (connection: ConnectionDto): any => ({
  name: connection.name,
  display_name: connection.display_name,
  passwordPolicy: connection.options?.passwordPolicy || 'good',
  password_complexity_options: connection.options?.password_complexity_options || { min_length: 8 },
  showSignup: connection.options?.showSignup || true,
  showForgot: connection.options?.showForgot || true,
  requires_username: connection.options?.requires_username || true,
  validation: connection.options?.validation || {
    username: { max: 15, min: 1 },
  },
});

mappers['facebook'] = (connection: ConnectionDto): any => ({
  name: connection.name,
  display_name: connection.display_name,
  scope:
    connection.options.scope ||
    'user_events,user_gender,user_friends,public_profile',
});

mappers['wechat'] = (connection: ConnectionDto): any => ({
  name: connection.name,
  display_name: connection.display_name,
  scope: connection.options?.scope || 'snsapi_login',
});

mappers['google-oauth2'] = (connection: ConnectionDto): any => ({
  name: connection.name,
  display_name: connection.display_name,
  scope: connection.options?.scope || ['email', 'profile'],
});

mappers['sms'] = (connection: ConnectionDto): any => ({
  name: connection.name,
  display_name: connection.display_name,
});

mappers['email'] = (connection: ConnectionDto): any => ({
  name: connection.name,
  display_name: connection.display_name,
});

export function mapConnection(connection: ConnectionDto) {
  const mapper = mappers[connection.strategy];
  if (mapper) return mapper(connection);

  return {
    name: connection.name,
    display_name: connection.display_name,
  };
}
