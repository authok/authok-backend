// import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
// import { PoliciesGuard } from 'libs/shared/src/policy/policy.guard';
// import { Tenant } from '../dto/tenant.dto';
// import { CreateTenantDto } from 'libs/dto/src';
// import { Connection, ConnectionConnection } from '../dto/connection.dto';
// import {
//   ResolveConnectionField,
//   ResolvedGlobalId,
//   GlobalIdFieldResolver,
//   ConnectionArgs,
// } from 'nestjs-relay';
// import { TenantService } from '../services/tenant.service'

// @Resolver(() => Tenant)
// // @UseGuards(PoliciesGuard)
// export class TenantResolver extends GlobalIdFieldResolver(Tenant) {
//   constructor(private tenantService: TenantService) {
//     super();
//   }

//   @Query(() => Tenant, {
//     nullable: true,
//     description: '获取应用',
//   })
//   async tenant(@Args('id') id: string): Promise<Tenant | null> {
//     const tenant = await this.tenantService.retrieve(id);
//     console.log(tenant)
//     return { ...tenant,  name: tenant.logo, id: new ResolvedGlobalId({type: 'Tenant', id: tenant.id})};
//   }

//   // @Mutation(() => Tenant, {
//   //   description: '新增应用',
//   // })
//   // async createTenant(
//   //   @Args() createTenant: CreateTenantDto): Promise<Tenant | null> {
//   //   const tenant = await this.tenantService.create(createTenant);
//   //   console.log(tenant)
//   //   // return { ...tenant, id: new ResolvedGlobalId({type: 'Tenant', id: tenant.id})}
//   //   return null;
//   // }

//   /*
//   @ResolveConnectionField(() => Connection)
//   async connections(
//     @Args() args: ConnectionArgs,
//     @Parent() parent: Tenant,
//   ): Promise<ConnectionConnection> {
//     return {
//       edges: [],
//       total: 3,
//       pageInfo: {
//         startCursor: '1',
//         endCursor: '2',
//         hasNextPage: true,
//         hasPreviousPage: false,
//       },
//     };
//   }
//   */
// }
