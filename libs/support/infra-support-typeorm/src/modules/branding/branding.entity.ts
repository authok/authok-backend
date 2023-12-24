import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BrandingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  colors: Record<string, any>;
}
