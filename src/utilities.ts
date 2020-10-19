import assistants from './assistants';
import schedules from './schedules';
import state from './state';
import { PartialTextBasedChannelFields } from 'discord.js';
import { schedule } from 'node-cron';

export function assignCronJobsTo(channel: PartialTextBasedChannelFields): void {
  Object.keys(schedules).forEach(cron => {
    const message = schedules[cron];
    const action = () => channel.send(`${message} ${getStringifiedAssistants()}`)
    state.cronSchedules.push(schedule(cron, action).start());
  });

  state.isCronActivated = true;
  state.client.user.setActivity('Cron jobs.');
}

export function destroyAllCronJobs(): void {
  state.isCronActivated = false;
  state.cronSchedules.forEach(schedule => schedule.destroy());
}

export function getStringifiedAssistants(): string {
  return Object.values(assistants)
    .map(id => `<@${id}>`)
    .join(' ');
}
