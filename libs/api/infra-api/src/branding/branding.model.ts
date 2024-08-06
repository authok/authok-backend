import { OmitType } from '@nestjs/swagger';

export class BrandingModel {
  id: string;
}

export class UpdateBrandingModel extends OmitType(BrandingModel, ['id']) {}
