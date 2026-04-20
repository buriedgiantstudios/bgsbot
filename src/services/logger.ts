
// tslint:disable:no-console

import { OnlyInstantiableByContainer, Singleton } from 'typescript-ioc';
import { BaseService } from '../base/BaseService';
import * as Discord from 'discord.js';

@Singleton
@OnlyInstantiableByContainer
export class Logger extends BaseService {

  public async init(client: Discord.Client) {
    super.init(client);

    this.watchGlobalUncaughtExceptions();
  }

  log(...args: Array<unknown>) {
    console.log(this.timeStamp(), ...args);
  }

  error(...args: Array<unknown>) {
    console.error(this.timeStamp(), ...args);
  }

  private timeStamp() {
    return new Date();
  }

  private watchGlobalUncaughtExceptions() {
    process.on('uncaughtException', (e) => {
      this.error(e);
      process.exit(0);
    });
  }
}
