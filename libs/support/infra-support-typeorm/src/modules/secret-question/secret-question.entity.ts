import { Column, Entity, ManyToOne } from 'typeorm';
import { GUID, GuidIdentity } from '../../common/guid.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'secret_questions',
})
@GUID()
export class SecretQuestionEntity extends GuidIdentity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  public text: string;
}

@Entity({
  name: 'secret_answers',
})
export class SecretAnswerEntity extends GuidIdentity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  public user: UserEntity;

  @ManyToOne(() => SecretQuestionEntity)
  public secretQuestion: SecretQuestionEntity;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public answer: string;
}
