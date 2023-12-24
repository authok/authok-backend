import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ITicketRegistry } from 'libs/api/ticket-api/src';

const defaultKey = 'default';

export function memoize(fn: Function) {
  const cache = {};
  return (...args) => {
    const n = args[0] || defaultKey;
    if (n in cache) {
      return cache[n];
    } else {
      const result = fn(n === defaultKey ? undefined : n);
      cache[n] = result;
      return result;
    }
  };
}

export type ITicketGuard = CanActivate; // & {};

function createTicketGuard(service: string) {
  return class TicketGuard implements CanActivate {
    constructor(private ticketRegistry: ITicketRegistry) {}

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const canProceed = true;

      console.log('ticketGuard: ', service);

      return canProceed;
    }
  };
}

export const TicketGuard: (service: string) => any = memoize(createTicketGuard);
