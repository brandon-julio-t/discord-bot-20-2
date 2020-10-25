import './core/bootstrap';

import store from './store';
import { Client } from 'discord.js';
import { handleGuildMemberUpdate, handleMessage, handleReady } from './handlers';

const client = (store.client = new Client());

client.on('ready', handleReady);
client.on('message', handleMessage);
client.on('guildMemberUpdate', handleGuildMemberUpdate);

client.login(process.env.TOKEN);
