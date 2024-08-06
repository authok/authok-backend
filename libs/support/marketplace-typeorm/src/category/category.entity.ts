import { Entity, Column } from "typeorm";
import { GuidIdentity } from "@libs/support/infra-support-typeorm/common/guid.entity";

@Entity({
  name: 'categories',
})
export class CategoryEntity extends GuidIdentity {
  @Column()
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;
}