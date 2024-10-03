import { events, managerBot } from "../index.js";
import { config } from '../config.js'
import ccxt from "ccxt";

export const allExchanges = ccxt.exchanges;

export const addHandlers = () => {
    // SHOW ALL EXCHANGES LIST
    managerBot.onText(events.getAllExchangesList, (msg) => {
        let text = "";
        config.page = 0;
        if (allExchanges.length === 0) {
            text = "There is no exchanges in the list";
        } else {
            text = allExchanges.slice(config.page * 20, (config.page + 1) * 20).join(",");
            text += text.length? ". Skip " + (config.page * 20) + " from "+ allExchanges.length + " exchanges." : "All the exchanges had been displayed";
        }

        return managerBot.sendMessage(msg.chat.id, text, {
            "reply_markup": {
                "keyboard": [
                    [events.getMore, events.goBack]
                ]
            }
        });
    });

    // PAGINATION FOR SELECTED EXCHANGES LIST
    managerBot.onText(events.getMore, (msg) => {
        if (config.prevCommand !== events.getAllExchangesList) return;

        config.page++;
        let text = "";
        if (allExchanges.length === 0) {
            text = "There is no coins yet";
        } else {
            text = allExchanges.slice(config.page * 20, (config.page + 1) * 20).join(",");
            text += text.length? ". Skip " + config.page * 20 +  " from "+ allExchanges.length + " exchanges." : "All the exchanges had been displayed";
        }

        return managerBot.sendMessage(msg.chat.id, text, {
            "reply_markup": {
                "keyboard": [
                    [events.getMore, events.goBack]
                ]
            }
        });
    });
}
