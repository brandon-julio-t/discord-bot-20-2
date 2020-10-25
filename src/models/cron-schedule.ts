import { Message } from 'discord.js';

export class CronSchedule {
  public constructor(private _cron: string, private _action: () => void | Promise<Message> | undefined) {}

  public get cron(): string {
    return this._cron;
  }

  public get action(): () => void | Promise<Message> | undefined {
    return this._action;
  }
}
