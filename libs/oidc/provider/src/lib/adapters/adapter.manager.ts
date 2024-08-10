import { Injectable } from '@nestjs/common';
import { IModelAdapter } from './model.adapter';

@Injectable()
export class AdapterManager {
  private adaptors = new Map<string, IModelAdapter>();

  register(name: string, creator: IModelAdapter) {
    this.adaptors[name] = creator;
  }

  get(name: string): IModelAdapter {
    return this.adaptors[name];
  }
}
