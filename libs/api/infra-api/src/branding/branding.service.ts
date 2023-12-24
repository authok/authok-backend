import { BrandingDto, UpdateBrandingDto } from './branding.dto';

export interface IBrandingService {
  retrieve(id: string): Promise<BrandingDto | undefined>;

  update(id: string, body: UpdateBrandingDto): Promise<BrandingDto>;
}
