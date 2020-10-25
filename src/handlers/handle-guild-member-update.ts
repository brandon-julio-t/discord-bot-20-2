import { GuildMember, PartialGuildMember } from 'discord.js';
import store from '../store';

export function handleGuildMemberUpdate(
  _: GuildMember | PartialGuildMember,
  newMember: GuildMember | PartialGuildMember
): void {
  if (!process.env.BOT_NAME) {
    console.error('BOT_NAME is not set.');
    return;
  }

  const isMemberBot: boolean = !!newMember.user?.bot;
  const isMe: boolean = newMember.client === store.client;
  const isUsernameCorrect: boolean = newMember.nickname === process.env.BOT_NAME;

  if (isMemberBot && isMe && !isUsernameCorrect) {
    newMember.setNickname(process.env.BOT_NAME);
  }
}
