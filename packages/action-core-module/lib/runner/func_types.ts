import { PostLoginApi } from '../api/api';
import { TriggerEvent } from '../model';

export type TriggerFunction = (event: TriggerEvent, ...args: any[]) => void;

export type OnExecutePostLogin = (
  event: TriggerEvent,
  api: PostLoginApi,
) => void;
