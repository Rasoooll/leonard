// import * as ccxt from "ccxt";
import { bybit } from "./init";
import { say } from "./tools";

export interface Positions {
  id: number;
  side: string;
  price: number;
  size: number;
  pnlUsd: number;
  pnlPercent: number;
  liquidity: number;
}

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
let ethOrders = "ETHUSDT";

export async function getPosistions() {
  let posisions = await bybit.fetchPositions([ethOrders]);
  let exPosisions: Positions[] = [];
  for (let index = 0; index < posisions.length; index++) {
    const element = posisions[index];
    if (element.entryPrice) {
      exPosisions.push({
        id: index,
        side: element.side,
        price: Number(element.entryPrice.toFixed(2)),
        size: Number(element.contracts),
        pnlUsd: Number(element.unrealizedPnl.toFixed(2)),
        pnlPercent: Number(element.percentage.toFixed(2)),
        liquidity: element.liquidationPrice,
      });
    }
    // console.log("position", element);
  }
  return exPosisions;
}
export async function printPositions() {
  let posisions = await bybit.fetchPositions([ethOrders]);
  console.log("********** Posisions");
  say(["********** Posisions"]);
  for (let index = 0; index < posisions.length; index++) {
    const element = posisions[index];
    if (element.enteryPrice) {
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
}
