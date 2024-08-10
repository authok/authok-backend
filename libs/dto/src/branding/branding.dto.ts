import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';


export class BrandingDto {
  @ApiProperty()
  id: string;
  
  @ApiPropertyOptional()
  logo_url?: string;

  @ApiPropertyOptional()
  colors?: Record<string, any>;
}

export class UpdateBrandingDto extends OmitType(BrandingDto, ['id']) {}
