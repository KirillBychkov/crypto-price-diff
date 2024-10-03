import { events, managerBot } from "../index.js";
import { config } from '../config.js'

export const addHandlers = () => {
    // START WITH MAIN MENU
    managerBot.onText(/\/start/, (msg) => {
        return managerBot.sendMessage(msg.chat.id, "Please choose operation", {
            "reply_markup": {
                "keyboard": [
                    [events.getAllCoinsList, events.getAllExchangesList],
                    [events.getSelectedCoinsList, events.getSelectedExchangesList],
                    [events.setSelectedCoinsList, events.setSelectedExchangesList]
                ]
            }
        });
    });

    // GO BACK FROM SELECTED COINS LIST
    managerBot.onText(events.goBack, (msg) => {
        config.page = 0;
        config.prevCommand = null;

        return managerBot.sendMessage(msg.chat.id, "Please choose operation", {
            "reply_markup": {
                "keyboard": [
                    [events.getAllCoinsList, events.getAllExchangesList],
                    [events.getSelectedCoinsList, events.getSelectedExchangesList],
                    [events.setSelectedCoinsList, events.setSelectedExchangesList]
                ]
            }
        });
    });

    // Middleware for every request
    managerBot.onText(/(.*?)/, (msg) => {
        if(msg.text !== events.goBack && msg.text !== events.getMore)
            config.prevCommand = msg.text;
    });
}
