import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, Repository } from 'typeorm';
import { OrganizationEntity, OrganizationMemberEntity } from './organization.entity';
import * as faker_cn from 'faker/locale/zh_CN';
import * as faker from 'faker';
import { InfraSupportTypeOrmModule } from '../../infra.support.typeorm.module';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';
import { plainToClass } from 'class-transformer';

describe('Organization', () => {
  let userRepo: Repository<UserEntity>;
  let organizationRepo: Repository<OrganizationEntity>;
  let organizationMemberRepo: Repository<OrganizationMemberEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InfraSupportTypeOrmModule],
    }).compile();

    const conn = getConnection('authok');
    userRepo = conn.getRepository<UserEntity>(UserEntity);
    organizationRepo = conn.getRepository<OrganizationEntity>(OrganizationEntity);
    organizationMemberRepo = conn.getRepository<OrganizationMemberEntity>(OrganizationMemberEntity);
  });

  afterEach(() => {
    const conn = getConnection('authok');
    return conn.close();
  });

  it('should be defined', () => {
    expect(organizationRepo).toBeDefined();
    expect(organizationMemberRepo).toBeDefined();
  });

  it('创建member', async () => {
    const organization = {
      tenant: 'brucke',
      name: faker.company.companyName(),
      display_name: faker_cn.company.companyName(),
    } as OrganizationEntity;

    await organizationRepo.save(organization);

    const user = userRepo.create({
      user_id: 'authok|123',
      name: 'user1',
      email: '229@gmail.com',
      connection: 'c1',
      tenant: 'brucke',
      identities: [
        {
          user_id: '123',
          provider: 'authok',
          connection: 'c1',
          is_social: false,
        },
      ],
    });

    await userRepo.save(user);

    const roles = [
      plainToClass(RoleEntity, {
        name: 'market',
        description: 'Market',
        tenant: 'brucke',
      }),
      plainToClass(RoleEntity, {
        name: 'public',
        description: 'Sales',
        tenant: 'brucke',
      }),
    ] as RoleEntity[];

    const member = {
      organization,
      user,
      roles,
    } as OrganizationMemberEntity;

    const savedMember = await organizationMemberRepo.save(member);
    console.log('savedMember: ', savedMember);
  });
});
