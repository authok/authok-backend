import { IContext } from "libs/shared/src/context";

export interface WebTaskConfig {
  node: string;
}

export interface WebTaskInstance {
  container: string;
}

export interface IWebTaskRunner {
  run(ctx: IContext, taskConfig: WebTaskConfig): Promise<WebTaskInstance>;
}