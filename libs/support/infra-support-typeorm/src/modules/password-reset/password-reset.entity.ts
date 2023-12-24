import { Request } from 'express';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'password_reset',
})
export class PasswordResetEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  token: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public user_id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public tenant: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public initializer_ip: string;

  @Column({
    nullable: true,
  })
  public created_at: Date;

  @Column({
    nullable: true,
  })
  public expires_at: Date;

  @BeforeInsert()
  private setupTokenAndExpiration(): void {
    if (this.created_at === undefined) {
      this.created_at = new Date();
    }

    if (this.expires_at === undefined) {
      this.expires_at = new Date(Date.now() + 10 * 60 * 1000); // Should be a 10 min expiration (Date.now() + 10 * 60 * 1000).toISOString();
    }
  }
}
