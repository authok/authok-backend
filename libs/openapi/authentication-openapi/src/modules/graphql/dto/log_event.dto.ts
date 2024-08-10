import { Field, Int, ObjectType } from '@nestjs/graphql';
import { NodeType, NodeInterface, PageInfo } from 'nestjs-relay';

@NodeType({ description: '事件' })
export class LogEvent extends NodeInterface {
  @Field({ nullable: false, description: 'uuid' })
  uuid?: string;

  @Field({
    name: 'published',
    nullable: false,
    description: '事件发布时间',
  })
  published: Date;

  @Field({ nullable: true, description: '事件类型' })
  eventType?: string;

  @Field({ nullable: true, description: '版本' })
  version?: string;

  @Field({ nullable: true, description: '事件级别' })
  severity?: string;

  @Field({ nullable: true, description: '显示信息' })
  displayMessage?: string;

  @Field({ nullable: true, description: '显示信息' })
  actor?: EventActor;

  @Field({ nullable: true, description: 'client' })
  client?: EventClient;

  @Field({ nullable: true, description: 'outcome' })
  outcome?: EventOutcome;

  @Field({ nullable: true, description: 'target' })
  target?: EventTarget[];

  @Field({ nullable: true, description: 'transaction' })
  transaction?: EventTransaction;

  @Field({ nullable: true, description: 'debugContext' })
  debugContext?: DebugContext;

  @Field({ nullable: true, description: 'authenticationContext' })
  authenticationContext?: AuthenticationContext;

  @Field({ nullable: true, description: 'securityContext' })
  securityContext: SecurityContext;

  @Field({ nullable: true, description: 'request' })
  request?: EventRequest;
}

@NodeType({ description: '事件执行者' })
export class EventActor extends NodeInterface {
  @Field({ nullable: false, description: 'type' })
  type?: string;

  @Field({ nullable: true, description: 'alternateId' })
  alternateId?: string;

  @Field({ nullable: true, description: 'displayName' })
  displayName?: string;

  @Field({ nullable: true, description: 'detailEntry' })
  detailEntry?: Record<string, string>;
}

@NodeType({ description: 'EventClient' })
export class EventClient extends NodeInterface {
  @Field({ nullable: true, description: 'userAgent' })
  userAgent?: UserAgent;

  @Field({ nullable: true, description: 'geographicalContext' })
  geographicalContext?: GeographicalContext;

  @Field({ nullable: true, description: 'zone' })
  zone?: string;

  @Field({ nullable: true, description: 'ipAddress' })
  ipAddress?: string;

  @Field({ nullable: true, description: 'device' })
  device?: string;
}

@NodeType({ description: 'UserAgent' })
export class UserAgent extends NodeInterface {
  @Field({ nullable: true, description: 'rawUserAgent' })
  rawUserAgent?: string;

  @Field({ nullable: true, description: 'os' })
  os?: string;

  @Field({ nullable: true, description: 'browser' })
  browser?: string;
}

@NodeType({ description: 'GeographicalContext' })
export class GeographicalContext extends NodeInterface {
  @Field({ nullable: true, description: 'geolocation' })
  geolocation?: Geolocation;

  @Field({ nullable: true, description: 'city' })
  city?: string;

  @Field({ nullable: true, description: 'state' })
  state?: string;

  @Field({ nullable: true, description: 'country' })
  country?: string;

  @Field({ nullable: true, description: 'postalCode' })
  postalCode?: string;
}

@NodeType({ description: 'Geolocation' })
export class Geolocation {
  @Field({ nullable: true, description: 'lat' })
  lat?: number;

  @Field({ nullable: true, description: 'lon' })
  lon?: number;
}

@NodeType({ description: 'Geolocation' })
export class EventOutcome {
  @Field({ nullable: true, description: 'result' })
  result?: string;

  @Field({ nullable: true, description: 'reason' })
  reason?: string;
}

@NodeType({ description: '' })
export class EventTarget extends NodeInterface {
  @Field({ nullable: false, description: 'result' })
  type?: string;

  @Field({ nullable: true, description: 'alternateId' })
  alternateId?: string;

  @Field({ nullable: true, description: 'alternateId' })
  displayName?: string;

  @Field({ nullable: true, description: 'detailEntry' })
  detailEntry?: Record<string, any>;
}

@NodeType({ description: 'EventTransaction' })
export class EventTransaction extends NodeInterface {
  @Field({ nullable: true, description: 'type' })
  type?: string;

  @Field({ nullable: true, description: 'detail' })
  detail?: Record<string, any>;
}

@NodeType({ description: 'DebugContext' })
export class DebugContext {
  @Field({ nullable: true, description: 'debugData' })
  debugData?: Record<string, any>;
}

@NodeType({ description: 'AuthenticationContext' })
export class AuthenticationContext {
  @Field({ nullable: true, description: 'authenticationProvider' })
  authenticationProvider?: string;

  @Field({ nullable: true, description: 'credentialProvider' })
  credentialProvider?: string;

  @Field({ nullable: true, description: 'credentialType' })
  credentialType?: string;

  @Field({ nullable: true, description: 'issuer' })
  issuer?: Issuer;

  @Field({ nullable: true, description: 'externalSessionId' })
  externalSessionId?: string;

  @Field({
    nullable: true,
    description: 'i.e. Outlook, Office365, wsTrust',
  })
  interface?: string;
}

@NodeType({ description: 'Issuer' })
export class Issuer extends NodeInterface {
  @Field({ nullable: true, description: 'type' })
  type?: string;
}

@NodeType({ description: 'Issuer' })
export class SecurityContext {
  @Field({ nullable: true, description: 'asNumber' })
  asNumber?: number;

  @Field({ nullable: true, description: 'asOrg' })
  asOrg?: string;

  @Field({ nullable: true, description: 'isp' })
  isp?: string;

  @Field({ nullable: true, description: 'domain' })
  domain?: string;

  @Field({ nullable: true, description: 'isProxy' })
  isProxy?: boolean;
}

@NodeType({ description: 'EventRequest' })
export class EventRequest {
  @Field({ nullable: true, description: 'ipChain' })
  ipChain?: IpAddress[];
}

@NodeType({ description: 'IpAddress' })
export class IpAddress {
  @Field({ nullable: true, description: 'ip' })
  ip?: string;

  @Field({ nullable: true, description: 'geographicalContext' })
  geographicalContext?: GeographicalContext;

  @Field({ nullable: true, description: 'version' })
  version?: string;

  @Field({ nullable: true, description: 'source' })
  source?: string;
}

export class LogEventEdge {
  @Field(() => String)
  readonly cursor!: string;

  @Field(() => LogEvent)
  readonly node!: LogEvent;
}

@ObjectType()
export class LogEventConnection {
  @Field(() => PageInfo)
  readonly pageInfo!: PageInfo;

  @Field(() => [LogEventEdge])
  readonly edges!: LogEventEdge[];

  @Field(() => Int)
  readonly total!: number;
}
