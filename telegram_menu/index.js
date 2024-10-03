import { addHandlers as main } from "./main.js";
import { addHandlers as allCoins } from "./allCoins.js";
import { addHandlers as allExchanges } from './allExchanges.js';
import { addHandlers as selectedCoins } from "./selectedCoins.js";
import { addHandlers as selectedExchanges } from "./selectedExchanges.js";

export function initBot() {
    // Events for all coins
    allCoins();

    // Events for all exchanges
    allExchanges();

    // Events for selected coins
    selectedCoins();

    // Events for selected exchanges
    selectedExchanges();

    // General events
    main();
}
