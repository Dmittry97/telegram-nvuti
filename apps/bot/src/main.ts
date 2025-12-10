import "dotenv/config";
import { Telegraf, Markup } from "telegraf";

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || "https://example.com";

if (!token) {
  throw new Error("BOT_TOKEN не задан в переменных окружения");
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  return ctx.reply(
    "Запускаем мини-приложение NVuti",
    Markup.keyboard([
      Markup.button.webApp("Открыть игру", webAppUrl)
    ]).resize()
  );
});

bot.command("help", (ctx) => {
  ctx.reply("Используйте кнопку WebApp, чтобы открыть игру в Telegram.");
});

bot.on("message", (ctx) => {
  const webAppData = (ctx.message as any).web_app_data;
  if (webAppData) {
    ctx.reply(`Данные из WebApp: ${webAppData.data}`);
  }
});

bot.launch().then(() => {
  // eslint-disable-next-line no-console
  console.log("Bot запущен");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
