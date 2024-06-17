//require('dotenv').config();
//const { Bot } = require('grammy');

//Telegrm Bot Testing
//TestJSBot
//pvlTest1bot

import dotenv from "dotenv";
import axios from "axios";
import { Bot, Keyboard, GrammyError, HttpError, InlineKeyboard } from "grammy";
//плагин для работы с инлайн клавиатурой
import { hydrate } from "@grammyjs/hydrate";

dotenv.config();

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

//Меню команд, массив объектов содержащий команды и их описание

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "menu",
    description: "Меню бота",
  },
  {
    command: "game",
    description: "Запуск игры",
  },
  /* {
    command: "hello",
    description: "Получить приветсвие",
  }, */
  /*  {
    command: "mood",

    description: "Оценка настроения",
  }, */
  /*  {
    command: "share",
    description: "Отправить местоположение",
  }, */
  /* {
    command: "inline",
    description: "test",
  }, */
  {
    command: "weather",
    description: "Какая погода за окном",
  },
  {
    command: "covid",
    description: "Ковид статистика",
  },
  {
    command: "link",
    description: "Ссылка в виде инлайн клавиатуры",
  },
]);

//adding event listener (ctx - context)
//Обработка команд
bot.command("start", async (ctx) => {
  await ctx.reply("Hello, i am your bot🫡", {
    /*
    Второй аргумент функции - объект в котором можно указать доп параметры
    В данном случае, бот отвечает на определённое сообщение пользователя
    по id сообщения*/
    reply_parameters: { message_id: ctx.msg.message_id },
    //Форматирование сообщений в виде кода HTML
    parse_mode: "HTML",
    //Чтобы отключить превью ссылки используется параметр
    //disable_web_page_preview: true,
  });
});

//Запуск игры
bot.command("game", async (ctx) => {
  await ctx.replyWithGame("hl3_game");
});

//массив команд работает как оператор или, обрабатываем сразу несколько команд
bot.command(["hello", "hi"], async (ctx) => {
  await ctx.reply(`Hello, ${ctx.from.first_name}:)`);
});

//Создание клавиатуры с помощью класса Keyboard
bot.command("mood", async (ctx) => {
  const moodKey = new Keyboard().text("Хорошо").text("Нормально").text("Плохо");
  //После row() начинается новая строка, метод resized() подгоняет размер кнопок
  //oneTime() - клавиатура исчезнет после отправки сообщения
  const moodKey2 = new Keyboard()
    .text("Хорошо")
    .row()
    .text("Нормально")
    .row()
    .text("Плохо")
    .resized()
    .oneTime();
  await ctx.reply("Как настроение", {
    //Отправляем клавиатуру вместе с сообщением
    reply_markup: moodKey2,
  });
});

bot.command("share", async (ctx) => {
  const shareKey = new Keyboard()
    .requestLocation("Геолокация")
    .requestContact("Контакт")
    .requestPoll("Опрос")
    .placeholder("Укажи данные")
    .oneTime()
    .resized();

  await ctx.reply("Чем поделишься?", {
    reply_markup: shareKey,
  });
});

bot.command("weather", async (ctx) => {
  const reqKey = new Keyboard().requestLocation("Тык📍").resized().oneTime();
  await ctx.reply("Где ты?", {
    reply_markup: reqKey,
  });
});

bot.command("covid", async (ctx) => {
  const result = await axios.get("https://disease.sh/v3/covid-19/all");
  //console.log(result.data);
  await ctx.reply(
    `Всего случаев: ${result.data.cases}\nВыздоровело: ${result.data.recovered}\nСмертей: ${result.data.deaths}`,
    {
      parse_mode: "HTML",
    }
  );
});

//Работа с inline клавиатурой
bot.command("inline", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button1")
    .text("2", "button2")
    .text("3", "button3");
  await ctx.reply("Answer", {
    reply_markup: inlineKeyboard,
  });
});

//обработка нажатий на клавиатуру происходит спомощью метода callbackQuery

bot.callbackQuery(["button1", "button2", "button3"], async (ctx) => {
  //ответ на callbackQuery
  await ctx.answerCallbackQuery();
  await ctx.reply(`Ты нажал ${ctx.callbackQuery.data} на клавиатуре`);
});

//При помощи метода on, его лучше использовать при большом количестве кнопок
/* bot.on("callback_query:data", async (ctx) => {
  await ctx.reply(`Ты нажал ${ctx.callbackQuery.data} на клавиатуре`);
});
 */

bot.command("link", async (ctx) => {
  const inLink = new InlineKeyboard().url(
    "Перейтина сайт",
    "https://www.youtube.com/"
  );
  await ctx.reply("Информация", {
    reply_markup: inLink,
  });
});

//создаём 2 инлайн клавиатуры
const menuKeyboard = new InlineKeyboard()
  .text("Telegram ID", "userID")
  .text("Помощь", "help");
const backKeyboard = new InlineKeyboard().text("< Назад", "back");
//Вызов меню
bot.command("menu", async (ctx) => {
  await ctx.reply("Меню", {
    reply_markup: menuKeyboard,
  });
});

//Обработка нажаития с помощью hydrate плагина
bot.callbackQuery("userID", async (ctx) => {
  await ctx.callbackQuery.message.editText(`Твой ID: ${ctx.from.id}`, {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});
bot.callbackQuery("help", async (ctx) => {
  await ctx.callbackQuery.message.editText(
    `Здесь должна быть помощь, но мне лень что-то писать :)`,
    {
      reply_markup: backKeyboard,
    }
  );
  await ctx.answerCallbackQuery();
});
bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText(`Меню`, {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

//Ответ на определённые сообщения
bot.hears("Хорошо", async (ctx) => {
  await ctx.reply("Отлично!");
});

bot.hears("Нормально", async (ctx) => {
  await ctx.reply("Отлично!");
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

bot.on(":contact", async (ctx) => {
  await ctx.reply("Спасибо за контакт");
  console.log(ctx.msg.contact.phone_number);
});

//ответ с сообщением отекущей погоде на отправленную  геолокацию
bot.on(":location", async (ctx) => {
  console.log(ctx.msg.location);
  const loc = [ctx.msg.location.latitude, ctx.msg.location.longitude];
  console.log(loc);
  const weather = await axios.get(
    `https://api.weatherbit.io/v2.0/current?lat=${loc[0]}&lon=${loc[1]}&key=${process.env.WEATHER_BIT_API_KEY}`
  );
  console.log(weather.data.data[0].app_temp);
  let temp = weather.data.data[0].app_temp;
  await ctx.reply(`Сейчас на улице ${weather.data.data[0].app_temp} ℃`, {
    //После отправки сообщения клавиатура исчезает
    reply_markup: { remove_keyboard: true },
  });
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

bot.on("callback_query:game_short_name", async (ctx) => {
  await ctx.answerCallbackQuery({ url:"https://t-rex-f6jx.onrender.com/"});
});


//starting bot
bot.start();
