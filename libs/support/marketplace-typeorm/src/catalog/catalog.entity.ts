import { Entity, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm";
import { CategoryEntity } from "../category/category.entity";
import { FeatureEntity } from "../feature/feature.entity";
import { GuidIdentity } from "@libs/support/infra-support-typeorm/common/guid.entity";

class Doc {
  skipSections: number[];
  apiUrl: string;
  id: string;
}

class Gallery {
  image: string;
  title: string;
  description: string;
}

@Entity({
  name: 'catalogs',
})
export class CatalogEntity extends GuidIdentity {
  @Column({ length: 32 })
  catalog_id: string;

  @Column({ name: 'company_name', nullable: true })
  company_name: string;

  @ManyToMany(() => CategoryEntity, {
    cascade: false,
    eager: true,
  })
  @JoinTable({
    name: 'catalog_categories',
    joinColumns: [{ name: 'catalog_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'category_id', referencedColumnName: 'id' }],
  })
  categories: CategoryEntity[];

  @Column({ length: 32, nullable: true })
  creator: string;
  
  @Column({ type: 'simple-json', nullable: true })
  docs: Doc[]; // {skipSections: [2, 5], apiUrl: "https://docs.authok.io/docs/meta/snippets/social/apple",…}
  
  @Column({ name: 'fk_feature_id', length: 48, nullable: true })
  feature_id: string;
  
  @ManyToOne(() => FeatureEntity, {
    eager: true,
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'fk_feature_id',
    referencedColumnName: 'id',
  })
  feature: FeatureEntity;

  @Column({ type: 'simple-json', nullable: true })
  gallery: Gallery[];
  
  @Column({ nullable: true })
  icon: string;
  // links: {partnerWebsiteText: "Sign in with Apple",…}
  @Column()
  metaDescription: string; // "Apple - The easy way to add Sign in with Apple to your app or website"
  
  @Column()
  metaTitle: string; //"Apple Integration with Auth0"
  
  @Column({ length: 32 })
  name: string; //"Apple"
  
  @Column({ default: 0 })
  rank: number; // 150
  
  @Column({ type: 'text', nullable: true })
  readme: string; //"https://cdn.auth0.com/marketplace/catalog/content/readme/social-connections/apple.json"

  @Column({ type: 'text', nullable: true })
  shortDescription: string; // "The easy way to add Sign in with Apple to your app or website"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'supported', length: 16 })
  supportLevel: string; // 'supported'

  @Column({ default: 'built-in', length: 16 })
  type: string; // "built-in"

  @Column({ length: 32 })
  slug: string;

  @Column({ nullable: true })
  creationUri: string;
}