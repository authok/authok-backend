import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '模板' })
export class Template {
  @Field({ nullable: true, description: '名称' })
  name?: string;

  @Field({ nullable: true, description: '类型' })
  type?: string;

  @Field({ nullable: true, description: '内容' })
  content?: string;

  @Field({ nullable: true, description: '多国语言翻译' })
  translations?: Record<string, string>;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
