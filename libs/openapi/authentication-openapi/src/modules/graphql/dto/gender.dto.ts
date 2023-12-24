import { registerEnumType } from "@nestjs/graphql";

// 性别
export enum Gender {
	// 男
	MALE,
	// 女
	FEMALE,
}

registerEnumType(Gender, { name: 'Gender' })