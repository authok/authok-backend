import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { parsePhoneNumber } from 'libphonenumber-js';

export class PhoneParseResult {
  phone_number?: string;
  phone_country_code?: string;
}

@Injectable()
export class PhoneParser {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  parse(s: string): PhoneParseResult {
    if (!s) return {};

    let phone_number: string;
    let phone_country_code: string;

    if (s && s.startsWith('+')) {
      const r = parsePhoneNumber(s);
      phone_number = r.nationalNumber.toString();
      phone_country_code = r.countryCallingCode.toString();
    } else {
      phone_number = s;
      phone_country_code = this.configService.get('default.phone_country_code');  
    }

    return { phone_number, phone_country_code };
  }
}