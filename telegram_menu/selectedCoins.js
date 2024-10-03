import { events, managerBot } from "../index.js";
import { allCoins } from "./allCoins.js";
import { config } from '../config.js'

export const addHandlers = () => {
    // SHOW SELECTED COINS LIST
    managerBot.onText(events.getSelectedCoinsList, (msg) => {
        let text = "";
        config.page = 0;
        if (config.selectedCoins.length === 0) {
            text = "There is no coins yet";
        } else {
            text = config.selectedCoins.slice(config.page * 20, (config.page + 1) * 20).map(e => e.slug).join(",");
            text += text.length? ". Skip " + (config.page * 20) + " from "+ config.selectedCoins.length + " coins." : "All selected coins had been displayed";
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
        if (config.prevCommand !== events.getSelectedCoinsList) return;

        config.page++;
        let text = "";
        if (config.selectedCoins.length === 0) {
            text = "There is no coins yet";
        } else {
            text = config.selectedCoins.slice(config.page * 20, (config.page + 1) * 20).map(e => e.slug).join(',');
            text += text.length? ". Skip " + (config.page * 20) + " from "+ config.selectedCoins.length + " coins." : "All selected coins had been displayed";
        }

        return managerBot.sendMessage(msg.chat.id, text, {
            "reply_markup": {
                "keyboard": [
                    [events.getMore, events.goBack]
                ]
            }
        });
    });

    // START SETTING NEW LIST OF SELECTED COINS
    managerBot.onText(events.setSelectedCoinsList, (msg) => {
        return managerBot.sendMessage(msg.chat.id, "Please send string separate by comma like xrp,ada,eth", {
            "reply_markup": { "keyboard": [[]] }
        });
    });

    // FINISH SETTING NEW LIST OF SELECTED COINS
    managerBot.onText(/^([a-z\-]+,?)+$/, (msg) => {
        if(config.prevCommand  !== events.setSelectedCoinsList) return;

        const splitted = msg.text.split(',');
        config.selectedCoins.length = 0;
        splitted.forEach(name => {
            const coin = allCoins.find(e => e.slug === name);
            if (coin) config.selectedCoins.push(coin);
        });
        console.log('Coins list updated: ', msg.text);
        return managerBot.sendMessage(msg.chat.id, "Coins saved to selected list");
    });

}
