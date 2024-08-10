export interface IEvent {}

export interface IEventManager {
  getEvent<T extends IEvent>(): T;
}

export class EventManager<T> implements IEventManager {
  private event: IEvent;

  constructor(event: IEvent) {
    this.event = event;
  }
  
  getEvent<T extends IEvent>(): T {
    return this.event as T;
  }
}