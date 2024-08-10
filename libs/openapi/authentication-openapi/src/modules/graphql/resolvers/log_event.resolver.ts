import {
  InputType,
  Resolver,
  Args,
} from '@nestjs/graphql';
import { LogEvent } from '../dto/log_event.dto';
import { ILogService } from 'libs/api/logstream-api/src/log.service';


@Resolver(() => LogEvent)
export class LogEventResolver {
  constructor(private logEventService: ILogService) {
  }

  async list() {
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
