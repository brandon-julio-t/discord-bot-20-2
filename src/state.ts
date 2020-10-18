import { Client } from 'discord.js';
import { ScheduledTask } from 'node-cron';

interface State {
  client: Client;
  cronQuote: ScheduledTask;
  cronSchedules: ScheduledTask[];
  isCronActivated: boolean;
}

export default {
  client: null,
  cronQuote: null,
  cronSchedules: [],
  isCronActivated: false,
} as State;
