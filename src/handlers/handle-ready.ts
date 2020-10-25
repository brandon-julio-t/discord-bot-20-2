import schedules from '../core/schedules';
import store from '../store';
import { schedule } from 'node-cron';
import { DiscordChannel } from '../typings/discord-channel';

export function handleReady(): void {
  if (!process.env.BOT_CHANNEL_ID) {
    console.error('BOT_CHANNEL_ID is not set.');
    return;
  }

  if (!process.env.BOT_NAME) {
    console.error('BOT_NAME is not set.');
    return;
  }

  console.log(`Logged in as ${store.client?.user?.tag}!`);
  store.channel = store.client?.channels.cache.get(process.env.BOT_CHANNEL_ID) as DiscordChannel;
  startAllCronJobs();
  store.client?.user?.setActivity('Cron jobs.');
  console.log(`Sending messages to channel ${process.env.BOT_CHANNEL_ID}`);

  store.client?.guilds.cache.forEach(guild => process.env.BOT_NAME && guild.me?.setNickname(process.env.BOT_NAME));
}

function startAllCronJobs() {
  schedules.forEach(cronSchedule => store.cronSchedules.push(schedule(cronSchedule.cron, cronSchedule.action).start()));
}
