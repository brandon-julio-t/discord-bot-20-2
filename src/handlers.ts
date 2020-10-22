import * as motivation from 'motivation';
import assistants from './assistants';
import state from './state';
import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js';
import { readSpecialShifts, readWorkingShifts } from './shifts-reader';
import schedules from './schedules';
import { schedule } from 'node-cron';
import ShiftType from './enums/shift-type';

export function handleReady() {
  readWorkingShifts();
  readSpecialShifts();

  console.log(`Logged in as ${state.client.user.tag}!`);
  state.channel = state.client.channels.cache.get(process.env.BOT_CHANNEL_ID) as TextChannel | DMChannel | NewsChannel;
  startAllCronJobs();
  state.client.user.setActivity('Cron jobs.');
  console.log(`Sending messages to channel ${process.env.BOT_CHANNEL_ID}`);
}

function startAllCronJobs() {
  Object.keys(schedules).forEach(cron => {
    const action = schedules[cron];
    state.cronSchedules.push(schedule(cron, action).start());
  });
}

export function handleMessage(message: Message) {
  const { channel, content } = message;
  const sadKeywords = [
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
  ];

  if (content.startsWith('!cron')) handleCron(channel);
  else if (content === '!assistants') handleAssistants(channel);
  else if (content === '!shifts') handleShifts(channel);
  else if (content === 'sembah gw' && message.author.username !== 'JP-A') message.reply('Sembah dewa :person_bowing:');
  else if (sadKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
    const { author, text } = motivation.get();
    const codeblock = '```';
    message.reply(
      `
${codeblock}
"${text}"
— ${author}
${codeblock}`.trim()
    );
  }
}

function handleCron(channel: TextChannel | DMChannel | NewsChannel) {
  const allCronsAreScheduled = state.cronSchedules.every(cron => cron.getStatus() === 'scheduled');
  channel.send(`Cron schedules are ${allCronsAreScheduled ? '' : 'not '}activated.`);
}

function handleAssistants(channel: TextChannel | DMChannel | NewsChannel) {
  channel.send(
    `
__**20-2 Assistants**__
${assistants.map((ast, idx) => `${idx + 1}. ${ast.initial} (${ast.mention()})`).join('\n')}`.trim()
  );
}

function handleShifts(channel: TextChannel | DMChannel | NewsChannel) {
  channel.send(
    `
__**Working Shifts**__
${state.assistantsWorkingShifts
  .map((workingShift, idx) => {
    const { assistant, shift } = workingShift;
    return `${idx + 1}. ${assistant.initial} (${assistants
      .filter(ast => ast.initial === assistant.initial)[0]
      .mention()}): ${shift === ShiftType.MORNING ? 'Pagi' : 'Malam'}`;
  })
  .join('\n')}

__**Today's Special Shifts**__
${state.assistantsSpecialShifts
  .filter(specialShift => specialShift.isToday)
  .map((specialShift, idx) => {
    const { assistant, shift } = specialShift;
    return `${idx + 1}. ${assistant.initial} (${assistants
      .filter(ast => ast.initial === assistant.initial)[0]
      .mention()}): ${shift === ShiftType.MORNING ? 'Pagi' : 'Malam'}`;
  })
  .join('\n')}
`.trim()
  );
}
