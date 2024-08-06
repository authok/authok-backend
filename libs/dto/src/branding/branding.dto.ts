import { OmitType } from '@nestjs/swagger';

export class BrandingDto {
  id: string;
}

export class UpdateBrandingDto extends OmitType(BrandingDto, ['id']) {}
