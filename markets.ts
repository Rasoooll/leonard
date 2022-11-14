import { say } from "./tools";
import { bybit } from "./init";

export async function getEthPrice() {
  // await bybit.loadMarkets();
  // console.log(bybit.market('ETHUSDT'));
  let ethInfo = await bybit.fetchTicker("ETHUSDT");
  say(["last ETH Price: " + ethInfo.last]);
  return Number(ethInfo.last);

  // console.log(markets);
  // for (let index = 0; index < markets.length; index++) {
  //     if (markets[index].id == "ETHUSDT"){
  //         console.log(markets[index]);

  //     }

  // }
}
