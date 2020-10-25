import { GuildMember } from 'discord.js';
import store from '../store';

export function handleGuildMemberUpdate(_: GuildMember, newMember: GuildMember) {
  const isMemberBot = newMember.user.bot;
  const isMe = newMember.client === store.client;
  const isUsernameCorrect = newMember.nickname === process.env.BOT_NAME;

  if (isMemberBot && isMe && !isUsernameCorrect) {
    newMember.setNickname(process.env.BOT_NAME);
  }
}
