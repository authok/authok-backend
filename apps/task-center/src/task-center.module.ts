import { Module } from "@nestjs/common";
import { SyncDeptsTask } from "./tasks/wework/sync.depts.task";
import { TaskController } from "./controllers/task.controller";
import { InfraCoreModule } from "libs/core/infra-core/src/infra.core.module";
import { InfraSupportTypeOrmModule } from "libs/support/infra-support-typeorm/src/infra.support.typeorm.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { NotificationModule } from "libs/core/notifications-core/src/notification.module";
import { NodeMailerMailModule } from "libs/support/mail-nodemailer/src/mail.module";
import { IPModule } from "libs/support/ipservice-support/src/ip.module";
import { LoggingTypeOrmModule } from "libs/support/logstream-typeorm/src/logging.module";
import { CloudNativeSmsModule } from "libs/support/sms-cloudnative/src/sms.module";
import configuration from './config/configuration';
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "libs/shared/src/shared.module";
import { SyncUsersTask } from "./tasks/wework/sync.users.task";
import { TenantGrpcClientModule } from "libs/client/tenant/src/tenant-grpc-client.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SharedModule,
    TenantGrpcClientModule,
    InfraCoreModule,
    InfraSupportTypeOrmModule,
    EventEmitterModule.forRoot({
      global: true,
    }),
    NotificationModule,
    NodeMailerMailModule,
    IPModule,
    LoggingTypeOrmModule,
    CloudNativeSmsModule,
  ],
  providers: [
    SyncDeptsTask,
    SyncUsersTask,
    {
      provide: 'tasks',
      useFactory: (syncDeptsTask: SyncDeptsTask, syncUsersTask: SyncUsersTask) => {
        const tasks = {};
        tasks['wework.sync_depts'] = syncDeptsTask;
        tasks['wework.sync_users'] = syncUsersTask;
        return tasks;
      },
      inject: [
        SyncDeptsTask,
        SyncUsersTask,
      ],
    }
  ],
  controllers: [
    TaskController,
  ]
})
export class TaskCenterModule {}