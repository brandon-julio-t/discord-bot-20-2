import schedules from '../core/schedules';
import store from '../store';
import { DiscordChannel } from '../core/type-aliases';
import { schedule } from 'node-cron';

export function handleReady() {
  console.log(`Logged in as ${store.client.user.tag}!`);
  store.channel = store.client.channels.cache.get(process.env.BOT_CHANNEL_ID) as DiscordChannel;
  startAllCronJobs();
  store.client.user.setActivity('Cron jobs.');
  console.log(`Sending messages to channel ${process.env.BOT_CHANNEL_ID}`);

  store.client.guilds.cache.forEach(guild => guild.me.setNickname(process.env.BOT_NAME));
}

function startAllCronJobs() {
  Object.keys(schedules).forEach(cron => {
    const action = schedules[cron];
    store.cronSchedules.push(schedule(cron, action).start());
  });
}
