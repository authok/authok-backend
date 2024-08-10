export interface IEvent {
}
export interface IEventManager {
    getEvent<T extends IEvent>(): T;
}
export declare class EventManager<T> implements IEventManager {
    private event;
    constructor(event: IEvent);
    getEvent<T extends IEvent>(): T;
}
