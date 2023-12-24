import {
  InputType,
  Resolver,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { User } from '../dto/user.dto';
import {
  ConnectionArgs,
  ResolveConnectionField,
  Connection,
  GlobalIdFieldResolver,
} from 'nestjs-relay';
import { connectionFromArray } from 'graphql-relay';
import { LogEvent, LogEventConnection } from '../dto/log_event.dto';
import { ILogService } from 'libs/api/logstream-api/src/log.service';

@InputType()
export class LogEventConnectionArgs extends ConnectionArgs {
  filter: string;
  q: string;
}

@Resolver(() => LogEvent)
export class LogEventResolver extends GlobalIdFieldResolver(User) {
  constructor(private logEventService: ILogService) {
    super();
  }

  @ResolveConnectionField(() => LogEvent)
  async list(@Args() args: LogEventConnectionArgs): Promise<LogEventConnection> {
    const conn: Connection<LogEvent> = connectionFromArray<LogEvent>([], args);
    return {
      total: 3,
      edges: [],
      pageInfo: {
        startCursor: '',
        endCursor: '',
        hasPreviousPage: false,
        hasNextPage: true,
      },
    };
  }
}
