import { Field } from '@nestjs/graphql';
import { NodeType, NodeInterface } from 'nestjs-relay';

@NodeType({ description: '模板' })
export class Template extends NodeInterface {
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
