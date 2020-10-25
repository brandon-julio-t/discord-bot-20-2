import * as motivation from 'motivation';
import assistants from './data/assistants';
import state from './state';
import { DMChannel, GuildMember, Message, NewsChannel, TextChannel } from 'discord.js';
import { readSpecialShifts, readWorkingShifts } from './shifts-reader';
import schedules from './schedules';
import { schedule } from 'node-cron';
import ShiftType from './enums/shift-type';
import { okKeywords, sadKeywords } from './data/keywords';

export function handleReady() {
  readWorkingShifts();
  readSpecialShifts();

  console.log(`Logged in as ${state.client.user.tag}!`);
  state.channel = state.client.channels.cache.get(process.env.BOT_CHANNEL_ID) as TextChannel | DMChannel | NewsChannel;
  startAllCronJobs();
  state.client.user.setActivity('Cron jobs.');
  console.log(`Sending messages to channel ${process.env.BOT_CHANNEL_ID}`);

  state.client.guilds.cache.forEach(guild => guild.me.setNickname(process.env.BOT_NAME));
}

function startAllCronJobs() {
  Object.keys(schedules).forEach(cron => {
    const action = schedules[cron];
    state.cronSchedules.push(schedule(cron, action).start());
  });
}

export function handleMessage(message: Message) {
  const { channel, content, guild } = message;

  guild.me.setNickname(process.env.BOT_NAME);

  if (content === '!assistants') handleAssistants(channel);
  if (content === '!shifts') handleShifts(channel);
  if (content.startsWith('!cron')) handleCron(channel);
  if (content.toLowerCase().includes('sembah') && !message.author.bot) message.reply('Sembah dewa :person_bowing:');
  if (okKeywords.some(keyword => content.toLowerCase().includes(keyword))) handleOk(message);
  if (sadKeywords.some(keyword => content.toLowerCase().includes(keyword))) handleSadKeywords(message);
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
      .mention()}): ${shift === ShiftType.MORNING ? 'pagi' : 'malam'}`;
  })
  .join('\n')}

__**Today Special Shifts**__

${state.assistantsSpecialShifts
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

export function handleGuildMemberUpdate(_: GuildMember, newMember: GuildMember) {
  if (newMember.client === state.client && newMember.nickname !== process.env.BOT_NAME) {
    newMember.setNickname(process.env.BOT_NAME);
  }
}
