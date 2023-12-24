import { DynamicModule } from '@nestjs/common';
export interface ActionModuleOptions {
    scriptPath: string;
}
export declare class ActionModule {
    static register(options: ActionModuleOptions): DynamicModule;
}
