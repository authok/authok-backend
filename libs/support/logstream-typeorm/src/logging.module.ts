import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LogEvent } from './log.entity';
import { LogService } from './log.service';
import { LogStream } from './logstream.entity';
import { LogStreamService } from './logstream.service';
import { LogEventHandler } from './log.event.handler';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'logstream',
      useFactory: () => {
        return {
          type: process.env.DRIVER || 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: +process.env.DB_PORT || 5432,
          username: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || 'root',
          database: process.env.DB_DATABASE_LOGSTREAM || 'authok_logstream',
          // entities: ['**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: !!process.env.DB_SYNCHRONIZE,
          timezone: process.env.TIMEZONE || 'Z',
          logging: Object.is(process.env.DB_LOGGING, 'true'),
          // cli: {
          //  migrationsDir: 'src/migrations',
          // },
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([LogEvent, LogStream], 'logstream'),
  ],
  providers: [
    {
      provide: 'ILogService',
      useClass: LogService,
    },
    {
      provide: 'ILogStreamService',
      useClass: LogStreamService,
    },
    LogEventHandler,
  ],
  exports: ['ILogService', 'ILogStreamService'],
})
export class LoggingTypeOrmModule {}
