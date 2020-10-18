import assistants from './assistants';
import state from './state';
import { Message, PartialTextBasedChannelFields } from 'discord.js';
import { assignCronJobsTo, destroyAllCronJobs } from './utilities';
import { getQuote } from 'inspirational-quotes';
import { schedule } from 'node-cron';

export function handleReady() {
  console.log(`Logged in as ${state.client.user.tag}!`);

  const channel = (state.client.channels.cache.get(
    process.env.BOT_CHANNEL_ID
  ) as unknown) as PartialTextBasedChannelFields;
  assignCronJobsTo(channel);

  console.log(`Sending messages to channel ${process.env.BOT_CHANNEL_ID}`);
}

export function handleMessage(message: Message) {
  const { channel, content } = message;

  if (content.startsWith('!cron')) {
    handleCron(message);
  } else if (content.startsWith('!quote')) {
    handleQuote(message);
  } else if (content === '!assistants') {
    channel.send(
      Object.values(assistants)
        .map((id, idx) => `${idx + 1}. <@${id}>`)
        .join('\n')
    );
  }
}

export function handleCron(message: Message) {
  const { channel, content } = message;

  if (content === '!cron stop') {
    destroyAllCronJobs();
    channel.send('All cron schedules destroyed.');
    return;
  }

  channel.send(`Cron schedules are ${state.isCronActivated ? '' : 'not '}activated.`);

  if (state.isCronActivated) return;

  if (content === '!cron start') {
    assignCronJobsTo(channel);
    channel.send('Cron schedules started.');
  }
}

export function handleQuote(message: Message) {
  const { channel, content } = message;

  if (content.includes('stop')) {
    state.cronQuote.stop();
    channel.send('Stop spitting out quotes.');
    return;
  }

  const interval: number = Number(content.replace('!quote ', ''));

  if (isNaN(interval)) return;

  if (state.cronQuote !== null) state.cronQuote.stop();

  state.cronQuote = schedule(`*/${interval} * * * * *`, () => {
    const quote = getQuote();
    channel.send(`> _"${quote.text}"_ — ${quote.author}`.replace(/[\s]+/g, ' '));
  }).start();

  channel.send(`Spitting out quotes at one quote per ${interval} second.`);
}
