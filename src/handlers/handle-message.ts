import * as motivation from 'motivation';
import ShiftType from '../enums/shift-type';
import assistants from '../data/assistants';
import store from '../store';
import { DiscordChannel } from '../typings/discord-channel';
import { Message } from 'discord.js';
import { okKeywords, sadKeywords } from '../data/keywords';

export function handleMessage(message: Message) {
  const { channel, content } = message;

  if (content === '!assistants') handleAssistants(channel);
  if (content === '!shifts') handleShifts(channel);
  if (content.startsWith('!cron')) handleCron(channel);
  if (content.toLowerCase().includes('sembah') && !message.author.bot) message.reply('Sembah dewa :person_bowing:');
  if (okKeywords.some(keyword => content.toLowerCase().includes(keyword))) handleOk(message);
  if (sadKeywords.some(keyword => content.toLowerCase().includes(keyword))) handleSadKeywords(message);
}

function handleCron(channel: DiscordChannel) {
  const allCronsAreScheduled = store.cronSchedules.every(cron => cron.getStatus() === 'scheduled');
  channel.send(`Cron schedules are ${allCronsAreScheduled ? '' : 'not '}activated.`);
}

function handleAssistants(channel: DiscordChannel) {
  channel.send(
    `
__**20-2 Assistants**__

${assistants.map((ast, idx) => `${idx + 1}. ${ast.initial} (${ast.mention()})`).join('\n')}`.trim()
  );
}

function handleShifts(channel: DiscordChannel) {
  channel.send(
    `
__**Working Shifts**__

${store.assistantsWorkingShifts
  .map((workingShift, idx) => {
    const { assistant, shift } = workingShift;
    return `${idx + 1}. ${assistant.initial} (${assistants
      .filter(ast => ast.initial === assistant.initial)[0]
      .mention()}): ${shift === ShiftType.MORNING ? 'pagi' : 'malam'}`;
  })
  .join('\n')}

__**Today Special Shifts**__

${store.assistantsSpecialShifts
  .filter(specialShift => specialShift.isToday)
  .map((specialShift, idx) => {
    const { assistant, shift } = specialShift;
    return `${idx + 1}. ${assistant.initial} (${assistants
      .filter(ast => ast.initial === assistant.initial)[0]
      .mention()}): ${shift === ShiftType.MORNING ? 'pagi' : 'malam'}`;
  })
  .join('\n')}
`.trim()
  );
}

function handleSadKeywords(message: Message) {
  const { author, text } = motivation.get();
  const codeblock = '```';
  message.reply(
    `
${codeblock}
"${text}"
— ${author}
${codeblock}
`.trim()
  );
}

function handleOk(message: Message) {
  const okEmojis: string[] = ['🆗', '👌', '👍'];
  const idx: number = Math.floor(Math.random() * okEmojis.length);
  message.react(okEmojis[idx]);
}
