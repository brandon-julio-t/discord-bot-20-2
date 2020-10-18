import schedules from './schedules';
import state from './state';
import { PartialTextBasedChannelFields } from 'discord.js';
import { schedule } from 'node-cron';

export function assignCronJobsTo(channel: PartialTextBasedChannelFields): void {
  Object.keys(schedules).forEach(cron => {
    const action = schedules[cron](channel);
    state.cronSchedules.push(schedule(cron, action).start());
  });

  state.isCronActivated = true;
  state.client.user.setActivity('Cron jobs.');
}

export function destroyAllCronJobs(): void {
  state.isCronActivated = false;
  state.cronSchedules.forEach(schedule => schedule.destroy());
}
