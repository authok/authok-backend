import { Entity, Column } from "typeorm";
import { GuidIdentity } from "@libs/support/infra-support-typeorm/common/guid.entity";

@Entity({
  name: 'features',
})
export class FeatureEntity extends GuidIdentity {
  @Column()
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  label: string;
}