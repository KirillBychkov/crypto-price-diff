import got from "got";
import { CronJob } from "cron";
import { managerBot} from "./index.js";
import { chatIDForMessages } from "./config.js";

const state = ["🔴", "🟠", "🟢"];

export function startCronJobs() {
  const every5Job = new CronJob(
    '*/10 * * * * *', async function () {
        const res = await got.get("http://64.225.108.221:3001/status");
        console.log('Get statuses...');
        const data = JSON.parse(res.body);
        data.percentage.forEach(elem => {
            (async () => {
                const pos = data.response[elem.chain];
                console.log({ ...elem });
                if(+elem.value > 0.4) {
                    const text =
                        "*" + elem.chain.toUpperCase() + " " + state[2] +
                        "\nBuy " + "CEX" + " - Sell " + "CEX" +
                        "\n" + (new Date()).toString().split('G')[0] + "*\n" +
                        "\n" + +elem.value + "%\n" +

                        "\n***buy***\nprice: " + pos.buy.asks.price +
                        "\nvolume: " + pos.buy.asks.volume +
                        "\ncosts: " + pos.buy.asks.cost +
                        "\ndepth: " + pos.buy.asks.depth +
                        (pos.buy.marketUrl? "\n[" + pos.buy.marketUrl + "](" + pos.buy.marketUrl + ")\n" : "\n") +

                        "\n***sell***\nprice: " + pos.sell.bids.price +
                        "\nvolume: " +  pos.sell.bids.volume +
                        "\ncosts: " + pos.sell.bids.cost +
                        "\ndepth: " + pos.sell.bids.depth +
                        (pos.sell.marketUrl? "\n[" + pos.sell.marketUrl + "](" + pos.sell.marketUrl + ")" : "");

                    await managerBot.sendMessage(chatIDForMessages, text, { parse_mode: 'Markdown' });
                }
            })();
        });

      },
    null,
    true,
    'utc',
  );

  return {
    every5Job
  };
}
