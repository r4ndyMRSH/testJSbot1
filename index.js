//require('dotenv').config();
//const { Bot } = require('grammy');

//Telegrm Bot Testing
//TestJSBot
//pvlTest1bot

import dotenv from "dotenv";
import { Bot, GrammyError, HttpError } from "grammy";

dotenv.config();

const bot = new Bot(process.env.BOT_API_KEY);

//adding event listener (ctx - context)

//Обработка команды старт
bot.command("start", async (ctx) => {
  await ctx.reply("Hello, i am your bot!");
});

//Обработчик ошибок (нужны GrammyError, HttpError)

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling updaate ${ctx.update.update_id}`);
  const e = err.error;

  //Проверяем к какому типу относится ошибка
  if (e instanceof GrammyError) {
    console.log("Error  in request:", e.description);
  } else if (e instanceof HttpError) {
    console.log("Coul dnot contact Telegram:", e);
  } else {
    console.log("Unknown error", e);
  }
});

//Ответ на входящее сообщение
bot.on("message", async (ctx) => {
  await ctx.reply("Thinking...");
});

//starting bot
bot.start();
