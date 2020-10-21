import * as motivation from 'motivation';
import Shift from './models/shift';
import assistants from './assistants';
import state from './state';
import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js';
import { destroyAllCronJobs, getTodayWeekday, mention, startAllCronJobs } from './utilities';
import { readSpecialShifts, readWorkingShifts } from './shifts';

export function handleReady() {
  readWorkingShifts();
  readSpecialShifts();

  console.log(`Logged in as ${state.client.user.tag}!`);
  state.channel = state.client.channels.cache.get(process.env.BOT_CHANNEL_ID) as TextChannel | DMChannel | NewsChannel;
  startAllCronJobs();
  console.log(`Sending messages to channel ${process.env.BOT_CHANNEL_ID}`);
}

export function handleMessage(message: Message) {
  const { channel, content } = message;
  if (content.startsWith('!cron')) handleCron(message);
  else if (content === '!assistants') handleAssistants(channel);
  else if (content === '!shifts') handleShifts(channel);
  else if (content === 'sembah gw' && message.author.username !== 'JP-A') message.reply('Sembah dewa :person_bowing:');
  else if (
    [
      'sedih',
      'sad',
      'galau',
      'stress',
      'sed',
      ':(',
      ':<',
      ":'(",
      ":'<",
      'nangis',
      'cry',
      'depresi',
      'depressed',
      'depression',
    ].some(keyword => content.toLowerCase().includes(keyword))
  ) {
    const quote = motivation.get();
    const codeblock = '```';
    message.reply(`${codeblock}\n"${quote.text}"\n— ${quote.author}\n${codeblock}`);
  }
}

function handleCron(message: Message) {
  const { channel, content } = message;

  if (content === '!cron stop') {
    destroyAllCronJobs();
    channel.send('All cron schedules destroyed.');
    return;
  }

  channel.send(`Cron schedules are ${state.isCronActivated ? '' : 'not '}activated.`);

  if (state.isCronActivated) return;

  if (content === '!cron start') {
    state.channel = channel;
    startAllCronJobs();
    channel.send('Cron schedules started.');
  }
}

function handleAssistants(channel: TextChannel | DMChannel | NewsChannel) {
  channel.send(
    Object.values(assistants)
      .map((id, idx) => `${idx + 1}. <@${id}>`)
      .join('\n')
  );
}

function handleShifts(channel: TextChannel | DMChannel | NewsChannel) {
  channel.send(`
__**Working Shifts**__
${state.assistantsWorkingShifts
  .map((workingShift, idx) => {
    const { assistant, shift } = workingShift;
    return `${idx + 1}. ${mention(assistants.filter(ast => ast.initial === assistant.initial)[0].id)}: ${
      shift === Shift.MORNING ? 'Pagi' : 'Malam'
    }`;
  })
  .join('\n')}

__**Today's Special Shifts**__
${state.assistantsSpecialShifts
  .filter(specialShift => specialShift.day === getTodayWeekday())
  .map((specialShift, idx) => {
    const { assistant, shift } = specialShift;
    return `${idx + 1}. ${mention(assistants.filter(ast => ast.initial === assistant.initial)[0].id)}: ${
      shift === Shift.MORNING ? 'Pagi' : 'Malam'
    }`;
  })
  .join('\n')}
`);
}
