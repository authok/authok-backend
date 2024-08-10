import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: "brandings"
})
export class BrandingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  logo_url?: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  colors: Record<string, any>;
}
