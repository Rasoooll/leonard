import { ProfileData } from './interfaces';
// import * as ccxt from "ccxt";
import { bybit, bybitPro } from "./init";
import { say } from "./tools";
import { BybitProPositionInfo, ccxtBybitPositions } from "./interfaces";

export async function getBalances() {
  let balance = await bybit.fetchBalance();
  // console.log("***** Balances");
  console.log(`Usd balance`, balance.USDT);

  const free = balance.USDT.free;
  const used = balance.USDT.used;
  const total = balance.USDT.total;

  let usedToTotal = (free / total) * 100;
  let freeToTotal = (free / total) * 100;
  let usedToFree = (used / free) * 100;
  // console.log(`Used To Total : `, usedToTotal.toFixed( 2 ) + " % ");
  // console.log(`Free To Total : `, freeToTotal.toFixed( 2 ) + " % ");
  // console.log(`Used To Free : `, usedToFree.toFixed( 2 ) + " % ");
  say(["********** Balances : "]);
  say([
    `Used To Total : ` + usedToTotal.toFixed(2) + " % ",
    `Free To Total : ` + freeToTotal.toFixed(2) + " % ",
    `Used To Free : ` + usedToFree.toFixed(2) + " % ",
  ]);
  return total;
}
export async function ordersLog() {
  let openOrders = await bybit.fetchOpenOrders("ETHUSDT");
  // console.log("********** Active Orders");
  say(["********** Active Orders"]);
  for (let index = 0; index < openOrders.length; index++) {
    let order = openOrders[index];

    // console.log(
    //     "price : "+order.price +
    //     " / amount: " + order.amount+
    //     " / side: "+ order.side
    //     );
    say([
      "price : " +
        order.price +
        " / amount: " +
        order.amount +
        " / side: " +
        order.side,
    ]);
  }
  // console.log(openOrders[0].price);
}
export async function usdtbalance() {
  let balance = await bybit.fetchBalance();
  return balance.USDT
}
let ethOrders = "ETHUSDT";

export async function getPosistions() {
  let positions:ccxtBybitPositions[] = await bybit.fetchPositions([ethOrders])
  ;
  // let exPositions: ProfileData[] = [];
  // for (let index = 0; index < positions.length; index++) {
  //   const element:ccxtBybitPositions = positions[index];
  //   if (element.entryPrice) {
  //     exPositions.push({
  //       id: index,
  //       side: element.side,
  //       entryPrice: Number(element.entryPrice.toFixed(2)),
  //       size: Number(element.contracts),
  //       unrealised_pnl: Number(element.unrealizedPnl.toFixed(2)),
  //       percentage: Number(element.percentage.toFixed(2)),
  //       liqPrice: element.liquidationPrice,
  //     });
  //   }
    // console.log("position", element);
  // }
  return positions;
}
export async function printPositions() {
  await bybit.fetchPositions([ethOrders]).then((x) => {
    // console.log(x);

    say(["********** positions"]);
    for (let index = 0; index < x.length; index++) {
        // console.log(" from here +++++++++++++++++++++",x);
      const element:ccxtBybitPositions = x[index];
      if (element.entryPrice) {
        console.log("Initial Margin : ", element.initialMargin);
        console.log("Margin Now :", element.initialMargin + element.unrealizedPnl);
        

        say([
          " # " +
            index +
            " -> " +
            element.side +
            " / price: " +
            element.entryPrice.toFixed(2) +
            " / size: " +
            element.contracts +
            " / pnl: " +
            element.unrealizedPnl.toFixed(2) +
            " $ " +
            " " +
            element.percentage.toFixed(2) +
            " % " +
            " / liq price : " +
            element.liquidationPrice,
        ]);
      }
    }
  });
}
//   console.log("********** positions");

// await bybitPro
//   .getPositions({
//     symbol: "ETHUSDT",
//   })
//   .then((x) => {
//     for (let i = 0; i < x.result.list.length; i++) {
//       const element = x.result.list[i];
//       console.log(element);
//     }
//   });
export async function printPositionsPro() {
  await bybitPro.getPositions({ symbol: ethOrders }).then((x) => {
    // console.log(x);
    let list = x.result.list;
    say(["********** positions"]);
    // console.log(list);

    for (let index = 0; index < list.length; index++) {
      const element: BybitProPositionInfo = list[index];
      if (element.entryPrice) {
        console.log("initialMargin", element.positionBalance);

        say([
          " # " +
            index +
            " -> " +
            element.side +
            " / price: " +
            element.entryPrice +
            " / size: " +
            element.size +
            " / pnl: " +
            element.unrealisedPnl +
            " $ " +
            // " " +
            // element.percentage +
            // " % " +
            " / liq price : " +
            element.liqPrice,
        ]);
      }
    }
  });
}
