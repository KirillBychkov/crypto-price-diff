import got from "got";
import { CronJob } from "cron";
import { managerBot} from "./index.js";
import { chatIDForMessages } from "./config.js";

const state = ["🔴", "🟠", "🟢"];

export function startCronJobs() {
  const every5Job = new CronJob(
    '*/10 * * * * *', async function () {
        console.log('Get statuses...');
        const [res1, res2, res3] = await Promise.all([
            got.get("http://64.225.108.221:3001/status"),
            got.get("http://164.90.189.154:3001/status"),
            got.get("http://167.99.250.107:3001/status"),
        ]);
        const data1 = JSON.parse(res1.body), data2 = JSON.parse(res2.body), data3 = JSON.parse(res3.body);
        const data = {
            percentage: [...data1.percentage, ...data2.percentage, ...data3.percentage],
            response: { ...data1.response, ...data2.response, ...data3.response },
            request: {
                cex: data1.request.cex,
                pairs: data1.request.pairs,
                workers: data1.request.workers + data2.request.workers + data3.request.workers,
                coins : [...data1.request.coins, ...data2.request.coins, ...data3.request.coins ]
            },
        };

        data.percentage.forEach(elem => {
            (async () => {
                const pos = data.response[elem.chain],
                    timeCheckedBuy = Math.abs(+new Date() - +new Date(pos.buy.time)),
                    timeCheckedSell = Math.abs(+new Date() - +new Date(pos.sell.time));
                console.log({ ...elem, timeCheckedBuy, timeCheckedSell });
                if(+elem.value > 0.5 && timeCheckedSell < 25000 && timeCheckedSell < 25000) {
                    const text =
                        "*" + elem.chain.toUpperCase() + " " + state[2] +
                        "\nBuy " + "CEX" + " - Sell " + "CEX" +
                        "\n" + (new Date()).toString().split('G')[0] + "*\n" +
                        "\n" + ("Checked " + (Math.round(Math.max(timeCheckedSell, timeCheckedBuy) / 1000)) +  " seconds ago...") +
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

                    await managerBot.sendMessage(chatIDForMessages, text, { parse_mode: 'Markdown', message_thread_id: 428 });
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
