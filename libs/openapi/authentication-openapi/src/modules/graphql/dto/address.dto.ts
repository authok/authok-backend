import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Address {

	@Field({ nullable: true, description: '国家' })
	country?: string;

	@Field({ nullable: true, description: '省' })
	province?: string;

	@Field({ nullable: true, description: '市' })
	city?: string;

	@Field({ nullable: true, description: '区' })
	district?: string;

	@Field({ nullable: true, description: '详细地址' })
	address?: string;

	@Field({ name: 'postal_code', nullable: true, description: '邮编' })
	postalCode?: string;
}
