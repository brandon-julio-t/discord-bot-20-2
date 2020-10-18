import { PartialTextBasedChannelFields } from 'discord.js';

import assistants from './assistants';

export default {
  '0 6 * * mon-sat': (channel: PartialTextBasedChannelFields) => () => channel.send('Bangun gengs.'),
  '50 6 * * mon-sat': (channel: PartialTextBasedChannelFields) => () => channel.send('Shift pagi clock in gengs.'),
  '50 10 * * mon-sat': (channel: PartialTextBasedChannelFields) => () => channel.send('Shift malam clock in gengs.'),
  '0 15 * * mon-fri': (channel: PartialTextBasedChannelFields) => () => channel.send('Shift malam clock out gengs.'),
  '0 19 * * mon-fri': (channel: PartialTextBasedChannelFields) => () => channel.send('Shift pagi clock out gengs.'),
  '0 13 * * sat': (channel: PartialTextBasedChannelFields) => () => channel.send('Shift pagi clock out gengs.'),
  '0 17 * * sat': (channel: PartialTextBasedChannelFields) => () => channel.send('Shift malam clock out gengs.'),
  '0 21 * * sat': (channel: PartialTextBasedChannelFields) => () =>
    channel.send(
      `Eval Angkatan gengs. ${Object.values(assistants)
        .map(id => `<@${id}>`)
        .join(' ')}`
    ),
};
