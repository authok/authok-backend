import { BrandingModel, UpdateBrandingModel } from './branding.model';

export interface IBrandingService {
  retrieve(id: string): Promise<BrandingModel | undefined>;

  update(id: string, body: UpdateBrandingModel): Promise<BrandingModel>;
}
