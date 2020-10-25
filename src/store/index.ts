import SpecialShift from '../models/special-shift';
import WorkingShift from '../models/working-shift';
import { Client } from 'discord.js';
import { DiscordChannel } from '../core/type-aliases';
import { ScheduledTask } from 'node-cron';

interface State {
  assistantsSpecialShifts: SpecialShift[];
  assistantsWorkingShifts: WorkingShift[];
  channel: DiscordChannel | null;
  client: Client | null;
  cronSchedules: ScheduledTask[];
}

export default {
  assistantsSpecialShifts: [],
  assistantsWorkingShifts: [],
  channel: null,
  client: null,
  cronSchedules: [],
} as State;
