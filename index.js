//require('dotenv').config();
//const { Bot } = require('grammy');

//Telegrm Bot Testing
//TestJSBot
//pvlTest1bot

import dotenv from 'dotenv';
import {Bot} from "grammy";

dotenv.config();

const bot = new Bot(process.env.BOT_API_KEY);

//adding event listener
//ctx - context
bot.command('start', async (ctx)=>{
    await ctx.reply("Hello, i am your bot!");
});
bot.on('message', async (ctx)=>{
    await ctx.reply("Thinking...");
});

//starting bot
bot.start();