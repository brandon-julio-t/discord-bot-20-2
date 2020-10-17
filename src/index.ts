import { Client, Message, MessageAttachment } from 'discord.js';
import { getQuote } from 'inspirational-quotes';
import { schedule, ScheduledTask } from 'node-cron';

import { config } from 'dotenv';
config();

const client: Client = new Client();
const cronSchedules: ScheduledTask[] = [];

let cronQuote: ScheduledTask | null = null;
let isCronActivated: boolean = false;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Nothing');
});

client.on('message', (message: Message) => {
  try {
    const { author, channel, content } = message;
    const { username } = author;

    if (content === 'ping') {
      message.reply('pong');
    } else if (username === 'This Is OS') {
      message.reply('bacot bot alsut');
    } else if (content === '!cron status') {
      channel.send(`Cron schedules are ${isCronActivated ? '' : 'not '}activated.`);
    } else if (['!cron', '!cron start'].includes(content)) {
      const schedules = {
        '0 6 * * mon-sat': () => channel.send('Bangun gengs.'),
        '50 6 * * mon-sat': () => channel.send('Shift pagi clock in gengs.'),
        '50 10 * * mon-sat': () => channel.send('Shift malam clock in gengs.'),
        '0 15 * * mon-fri': () => channel.send('Shift malam clock out gengs.'),
        '0 19 * * mon-fri': () => channel.send('Shift pagi clock out gengs.'),
        '0 13 * * sat': () => channel.send('Shift pagi clock out gengs.'),
        '0 17 * * sat': () => channel.send('Shift malam clock out gengs.'),
        '0 21 * * sat': () =>
          channel.send(
            `Eval Angkatan gengs. ${[
              '267590135162470401', // JP
              '272641788789915648', // ST
              '367296175096725506', // VN
              '636201389940408341', // LL
              '640864098271100929', // CC
              '646164977396482090', // TC
              '659069308617621514', // GA
              '727839410212569128', // BR
            ]
              .map(id => `<@${id}>`)
              .join(' ')}`
          ),
      };

      for (const cron in schedules) {
        const action = schedules[cron];
        cronSchedules.push(schedule(cron, action).start());
      }

      isCronActivated = true;
      client.user.setActivity('Cron jobs.');
      channel.send('Cron schedules started.');
    } else if (content === '!stop') {
      cronSchedules.forEach(schedule => schedule.destroy());
      channel.send('All cron schedules destroyed.');
    } else if (content.includes('!quote')) {
      if (content === '!quote stop') {
        cronQuote.stop();
        channel.send('Stop spitting out quotes.');
        return;
      }

      const interval: number = Number(content.replace('!quote ', ''));

      if (isNaN(interval)) return;

      if (cronQuote !== null) cronQuote.stop();

      cronQuote = schedule(`*/${interval} * * * * *`, () => {
        const quote = getQuote();
        channel.send(`> _"${quote.text}"_ — ${quote.author}`.replace(/[\s]+/g, ' '));
      }).start();

      channel.send(`Spitting out quotes at one quote per ${interval} second.`);
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(process.env.TOKEN);
