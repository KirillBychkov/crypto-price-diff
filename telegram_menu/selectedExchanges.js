import { events, managerBot } from "../index.js";
import { allExchanges } from "./allExchanges.js";
import { config } from '../config.js'

export const addHandlers = () => {
    // SHOW SELECTED EXCHANGES LIST
    managerBot.onText(events.getSelectedExchangesList, (msg) => {
        let text = "";
        config.page = 0;
        if (config.selectedExchanges.length === 0) {
            text = "There is no exchanges yet";
        } else {
            text = config.selectedExchanges.slice(config.page * 20, (config.page + 1) * 20).join(",");
            text += text.length? ". Skip " + (config.page * 20) + " from "+ config.selectedExchanges.length + " coins." : "All selected exchanges had been displayed";
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
        if (config.prevCommand !== events.getSelectedExchangesList) return;

        config.page++;
        let text = "";
        if (config.selectedExchanges.length === 0) {
            text = "There is no exchanges yet";
        } else {
            text = config.selectedExchanges.slice(config.page * 20, (config.page + 1) * 20).join(',');
            text += text.length? ". Skip " + (config.page * 20) + " from "+ config.selectedExchanges.length + " coins." : "All selected exchanges had been displayed";
        }

        return managerBot.sendMessage(msg.chat.id, text, {
            "reply_markup": {
                "keyboard": [
                    [events.getMore, events.goBack]
                ]
            }
        });
    });

    // START SETTING NEW LIST OF SELECTED EXCHANGES
    managerBot.onText(events.setSelectedExchangesList, (msg) => {
        return managerBot.sendMessage(msg.chat.id, "Please send string separate by comma like binance,bybit,okx", {
            "reply_markup": { "keyboard": [[]] }
        });
    });

    // FINISH SETTING NEW LIST OF SELECTED EXCHANGES
    managerBot.onText(/^([a-z\-]+,?)+$/, (msg) => {
        if(config.prevCommand  !== events.setSelectedExchangesList) return;

        const splitted = msg.text.split(',');
        config.selectedExchanges.length = 0;
        splitted.forEach(name => {
            const coin = allExchanges.find(e => e === name);
            if (coin) config.selectedExchanges.push(coin);
        });
        console.log('Exchanges list updated: ', msg.text);
        return managerBot.sendMessage(msg.chat.id, "Exchanges saved to selected list");
    });

}
