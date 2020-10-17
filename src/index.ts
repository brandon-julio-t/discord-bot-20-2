import './load_env';

import * as Discord from 'discord.js';

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg: Discord.Message) => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login(process.env.TOKEN);
