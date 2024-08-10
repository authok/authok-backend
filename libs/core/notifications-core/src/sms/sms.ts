export abstract class ISms {
  from: string;
  to: string;
  countryCode: string;
}

export class Sms extends ISms {
  body: string;
}

export class TemplateSms extends ISms {
  templateId: string;
  params: Record<string, any>;
  sign: string;
}
