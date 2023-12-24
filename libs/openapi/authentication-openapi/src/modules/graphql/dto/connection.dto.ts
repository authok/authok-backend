import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { NodeInterface, PageInfo, NodeType } from 'nestjs-relay';

export enum ConnectionStrategy {
  ad,
  adfs,
  alipay,
  amazon,
  apple,
  dropbox,
  bitbucket,
  aol,
  authok_oidc,
  authok,
  baidu,
  bitly,
  box,
  custom,
  daccount,
  dwolla,
  email,
  evernote_sandbox,
  evernote,
  exact,
  facebook,
  fitbit,
  flickr,
  github,
  google_apps,
  google_oauth2,
  instagram,
  ip,
  linkedin,
  miicard,
  oauth1,
  oauth2,
  office365,
  oidc,
  paypal,
  paypal_sandbox,
  pingfederate,
  planningcenter,
  renren,
  salesforce_community,
  salesforce_sandbox,
  salesforce,
  samlp,
  sharepoint,
  shopify,
  sms,
  soundcloud,
  thecity_sandbox,
  thecity,
  thirtysevensignals,
  twitter,
  untappd,
  vkontakte,
  waad,
  wechat,
  weibo,
  windowslive,
  wordpress,
  yahoo,
  yammer,
  yandex,
  line,
}
registerEnumType(ConnectionStrategy, { name: 'ConnectionStrategy' });

@NodeType({
  description: '身份源代表 Authok 与用户源的关系，包括外部的Identity Provider、数据库、免密认证等',
})
export class Connection extends NodeInterface {
  @Field({ description: '名称' })
  name: string;

  @Field({
    name: 'display_name',
    nullable: true,
    description: '在登录界面展示的名称',
  })
  displayName?: string;

  // // TODO
  // options?: object;

  @Field(() => ConnectionStrategy, {
    description: '类型，决定了Identity Provider',
  })
  strategy: ConnectionStrategy;

  @Field(() => [String], {
    nullable: 'items',
    name: 'enabled_clients',
    description: '启用了此连接的client id列表',
  })
  enabledClients: string[];

  // realms

  // is_domain_connection

  // metadata
}

@ObjectType()
export class ConnectionEdge {
  @Field()
  readonly cursor: string;

  @Field(() => Connection)
  readonly node: Connection;
}

@ObjectType()
export class ConnectionConnection {
  @Field()
  pageInfo: PageInfo;

  @Field(() => [ConnectionEdge])
  edges: ConnectionEdge[];

  @Field(() => Int)
  total: number;
}
