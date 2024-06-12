//require('dotenv').config();
//const { Bot } = require('grammy');

//Telegrm Bot Testing
//TestJSBot
//pvlTest1bot

import dotenv from "dotenv";
import { Bot, GrammyError, HttpError } from "grammy";

dotenv.config();

const bot = new Bot(process.env.BOT_API_KEY);

//Меню команд, массив объектов содержащий команды и их описание

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "hello",
    description: "Получить приветсвие",
  },
  {
    command: "id",
    description: "Получить свой telegram id",
  },
]);

//adding event listener (ctx - context)
//Обработка команд
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Hello, i am your <a href='https://www.youtube.com/watch?v=q-AFR0D7Vuw&ab_channel=PomazkovJS'>bot</a> 🫡",
    {
      /*
    Второй аргумент функции - объект в котором можно указать доп параметры
    В данном случае, бот отвечает на определённое сообщение пользователя
    по id сообщения*/
      reply_parameters: { message_id: ctx.msg.message_id },
      //Форматирование сообщений в виде кода HTML
      parse_mode: "HTML",
      //Чтобы отключить превью ссылки используется параметр
      //disable_web_page_preview: true,
    }
  );
});

//массив команд работает как оператор или, обрабатываем сразу несколько команд
bot.command(["hello", "hi"], async (ctx) => {
  await ctx.reply(`Hello, ${ctx.from.first_name}:)`);
});

bot.command("id", async (ctx) => {
  await ctx.reply(`Твой ID в Telegram: ${ctx.from.id}`);
});

//Ответ на определённые сообщения
bot.hears("ping", async (ctx) => {
  await ctx.reply("pong");
});

//мы можем использовать регулярные выражения для ответа на сообщение  котором используются определённые слова
bot.hears([/жопа/, /fuck/], async (ctx) => {
  await ctx.reply("Ругаться очень не красиво!");
});
bot.hears([/Здравствуйте/, /Привет/, /Здарово/, /Хай/], async (ctx) => {
  await ctx.reply("Здравствуйте, чем могу помочь?");
});

bot.hears([/Спасибо/, /спасибо/], async (ctx) => {
  //Используем задержку, для того что быреакция отправлялась спустя время
  setTimeout(() => {
    //react отправляет "реакции" на сообщения
    ctx.react("👍");
  }, 1500);
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

//Ответ на входящее сообщение (крайне важна последовательность фильтров)
//Можно использовать фильтр, для ответа на разные типы сообщений
//так же как и в случае с коммандами можно обработать сразу несколько типов сообщений отправив массив в качестве типа сообщения

//в этом случае мы парсим сообщение и отвечаем только на те где есть ссылки
//можно сократить до "::url"
bot.on(["message:entities:url", "::email"], async (ctx) => {
  await ctx.reply("Получил ссылку");
});
bot.on("message:text", async (ctx) => {
  //можно сократить до (:text)
  let a = ctx.from.first_name;
  console.log(ctx.msg);
  await ctx.reply("Читаю");
  await ctx.reply(JSON.stringify(ctx.msg));
});

//комбинация фильтров
bot.on(":photo").on("::hashtag", async (ctx) => {
  await ctx.reply("Получил фото с хештегом");
});
bot.on("message:photo", async (ctx) => {
  await ctx.reply("Cool picture, man!");
});
bot.on("message:voice", async (ctx) => {
  await ctx.reply("Nice voice:)");
});

//starting bot
bot.start();
