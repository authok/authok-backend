import { ApiProperty } from '@nestjs/swagger';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { CursorQueryDto } from 'libs/common/src/pagination/cursor/cursor.dto';

export enum LogTypes {
  login_success, // s: Success Login (level: 1)
  exchange_success, // seacft: Success Exchange (level: 1)
  exchange_failed, // feacft: Failed Exchange (level: 3)
  login_failed, // f Failed Login (level: 3)
  login_warned, // w: Warnings During Login (level: 2)
  user_deleted, // du: Deleted User (level: 1)
  // login_failed, // fu: Failed Login (invalid email/username) (level: 3)
  // fp: Failed Login (wrong password) (level: 3)
  // fc: Failed by Connector (level: 3)
  cors_failed, // fco: Failed by CORS (level: 3)
  // con: Connector Online (level: 1)
  // coff: Connector Offline (level: 3)
  // fcpro: Failed Connector Provisioning (level: 4)
  signup_success, // ss: Success Signup (level: 1)
  signup_failed, // fs: Failed Signup (level: 3)
  code_sent, // cs: Code Sent (level: 0)
  code_link_sent, // cls: Code/Link Sent (level: 0)
  verification_email_sent, // sv: Success Verification Email (level: 0)
  verification_email_failed, // fv: Failed Verification Email (level: 0)
  change_password_success, // scp: Success Change Password (level: 1)
  // fcp: Failed Change Password (level: 3)
  change_email_success, // sce: Success Change Email (level: 1)
  change_email_failed, // fce: Failed Change Email (level: 3)
  change_username_success, // scu: Success Change Username (level: 1)
  change_username_failed, // fcu: Failed Change Username (level: 3)
  change_phone_number_success, // scpn: Success Change Phone Number (level: 1)
  change_phone_number_failed, // fcpn: Failed Change Phone Number (level: 3)
  verification_email_request_success, // svr: Success Verification Email Request (level: 0)
  verification_email_request_failed, // fvr: Failed Verification Email Request (level: 3)
  change_password_request_success, // scpr: Success Change Password Request (level: 0)
  change_password_request_failed, // fcpr: Failed Change Password Request (level: 3)
  send_notification_failed, // fn: Failed Sending Notification (level: 3)
  account_blocked, // limit_wc: Blocked Account (level: 4)
  limit_ui, // limit_ui: Too Many Calls to /userinfo (level: 4)
  api_limit, // api_limit: Rate Limit On API (level: 4)
  user_delete_success, // sdu: Successful User Deletion (level: 1)
  user_delete_failed, // fdu: Failed User Deletion (level: 3)
}

export class LogEventDto {
  date: Date;
  type?: string;
  description?: string;
  connection?: string;
  connection_id?: string;
  client_id?: string;
  client_name?: string;
  ip?: string;
  hostname?: string;
  tenant: string;
  user_id?: string;
  user_name?: string;
  audience?: string;
  scope?: string;
  strategy?: string;
  strategy_type?: string;
  id?: string;
  is_mobile?: boolean;
  details?: Record<string, any>;
  user_agent?: string;

  @ApiProperty({
    example: {
      country_code: '',
      country_code3: '',
      country_name: '',
      city_name: '',
      latitude: '',
      longitude: '',
      time_zone: '',
      continent_code: '',
    },
  })
  location_info: Record<string, any>;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class LogCursorQueryDto extends CursorQueryDto {
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  type: string | string[];
}