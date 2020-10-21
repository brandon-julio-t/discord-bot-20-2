import { Client, NewsChannel, DMChannel, TextChannel } from 'discord.js';
import { ScheduledTask } from 'node-cron';
import SpecialShift from './models/special-shift';
import WorkingShift from './models/working-shift';

interface State {
  assistantsSpecialShifts: SpecialShift[];
  assistantsWorkingShifts: WorkingShift[];
  channel: TextChannel | DMChannel | NewsChannel | null;
  client: Client;
  cronQuote: ScheduledTask;
  cronSchedules: ScheduledTask[];
  isCronActivated: boolean;
}

export default {
  assistantsSpecialShifts: [],
  assistantsWorkingShifts: [],
  channel: null,
  client: null,
  cronQuote: null,
  cronSchedules: [],
  isCronActivated: false,
} as State;
