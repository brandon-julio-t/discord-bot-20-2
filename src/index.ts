import state from './state';
import { Client } from 'discord.js';
import { config } from 'dotenv';
import { handleMessage, handleReady } from './handlers';

config();

const client = (state.client = new Client());

client.on('ready', handleReady);
client.on('message', handleMessage);
client.login(process.env.TOKEN);
