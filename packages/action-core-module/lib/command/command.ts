export interface ICommand {
  type: string;
  data: any;
}

export class BaseCommand implements ICommand {
  type: string;
  data: any;

  constructor(type: string, data: any) {
    this.type = type;
    this.data = data;
  }
}

export interface ICommandBus {
  push(cmd: ICommand);

  commands: Array<ICommand>;
}

export class CommandBus implements ICommandBus {
  private _commands = new Array<ICommand>();

  get commands(): Array<ICommand> {
    return this._commands;
  }

  push(cmd: ICommand) {
    this._commands.push(cmd);
  }
}