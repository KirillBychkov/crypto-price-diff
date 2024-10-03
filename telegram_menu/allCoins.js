import got from 'got';
import { events, managerBot } from "../index.js";
import { config } from '../config.js';

export const { data: allCoins } = await got.get("http://209.38.199.247:3000/slugs?limit=100&skip=0&sorted=rank:1");

export const addHandlers = () => {
    // SHOW ALL COINS LIST
    managerBot.onText(events.getAllCoinsList, (msg) => {
        let text = "";
        config.page = 0;
        if (allCoins.length === 0) {
            text = "There is no coins in the list";
        } else {
            text = allCoins.slice(config.page * 20, (config.page + 1) * 20).map(e => e.slug).join(",");
            text += text.length? ". Skip " + (config.page * 20) + " from "+ allCoins.length + " coins.": "All coins had been displayed";
        }

        return managerBot.sendMessage(msg.chat.id, text, {
            "reply_markup": {
                "keyboard": [
                    [events.getMore, events.goBack]
                ]
            }
        });
    });

    // PAGINATION FOR SELECTED COINS LIST
    managerBot.onText(events.getMore, (msg) => {
        if (config.prevCommand !== events.getAllCoinsList) return;

        config.page++;
        let text = "";
        if (allCoins.length === 0) {
            text = "There is no coins yet";
        } else {
            text = allCoins.slice(config.page * 20, (config.page + 1) * 20).map(e => e.slug).join(",");
            text += text.length? ". Skip " + config.page * 20 +  " from "+ allCoins.length + " coins.": "All coins had been displayed";
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
