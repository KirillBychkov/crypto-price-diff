import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
import { startCronJobs } from "./cron-jobs.js";
import { initBot } from "./telegram_menu/index.js";
import { botAPIkey } from "./config.js";

export const managerBot = new TelegramBot(botAPIkey, { polling: true });

export const events = {
    getAllCoinsList: "Get all coins list",
    getAllExchangesList: "Get all exchanges list",

    getSelectedCoinsList: "Get selected coins list",
    getSelectedExchangesList: "Get selected exchanges list",

    setSelectedCoinsList: "Set selected coins list",
    setSelectedExchangesList: "Set selected exchanges list",

    getMore: "Get next page",
    goBack: "Go to home",
};

const index = express();
index.use(bodyParser.json());
index.use(cors());

index.use('*', function (req, res) {
    res.send('Not found!');
});

index.listen(8085, function () {
    console.log('Started at port 8085');
});

startCronJobs();
initBot();
