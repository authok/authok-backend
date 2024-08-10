export interface ICommand {
    type: string;
    data: any;
}
export declare class BaseCommand implements ICommand {
    type: string;
    data: any;
    constructor(type: string, data: any);
}
export interface ICommandBus {
    push(cmd: ICommand): any;
    commands: Array<ICommand>;
}
export declare class CommandBus implements ICommandBus {
    private _commands;
    get commands(): Array<ICommand>;
    push(cmd: ICommand): void;
}
