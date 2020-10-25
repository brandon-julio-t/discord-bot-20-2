import './core/bootstrap';

import store from './store';
import { Client } from 'discord.js';
import { handleGuildMemberUpdate, handleMessage, handleReady } from './handlers';

(store.client = new Client())
  .on('ready', handleReady)
  .on('message', handleMessage)
  .on('guildMemberUpdate', handleGuildMemberUpdate)
  .login(process.env.TOKEN);
