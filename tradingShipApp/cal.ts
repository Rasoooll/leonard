import { positionLevrage } from "../config";
import { botPostisions, Orders, Ticker, TradeLog } from "../interfaces";

function calPnl(trade: botPostisions, ticker: Ticker) {
  if (trade.side == "long") {
    let p = ticker.close - trade.positionPrice;
    let pp = (p / trade.positionPrice) * positionLevrage;
    ticker.longPrice = trade.positionPrice;
    ticker.longMargin = trade.positionMargin;
    ticker.longPnl = Number(pp.toFixed(2));
    // ticker.longOrderAdd = trade
    // return;
  } else {
    let p = trade.positionPrice - ticker.close;
    let pp = (p / trade.positionPrice) * positionLevrage;
    ticker.shortPrice = trade.positionPrice;
    ticker.shortMargin = trade.positionMargin;
    ticker.shortPnl = Number(pp.toFixed(2));
    // return;
  }
  if (
    ticker.longPnl &&
    ticker.longMargin &&
    ticker.shortPnl &&
    ticker.shortMargin
  ) {
    ticker.boat = wAverage(
      ticker.longPnl,
      ticker.longMargin,
      ticker.shortPnl,
      ticker.shortMargin
    );
  }
}
function wAverage(p1: number, s1: number, p2: number, s2: number) {
  let avg = Number(((p1 * s1 + p2 * s2) / (s1 + s2)).toFixed(2));
  return avg;
}
function subPosition(
  trade: botPostisions,
  order: Orders,
  orders: Orders[],
  ticker: Ticker,
  logs: TradeLog[]
) {
  // console.log("sub position ...");

  console.log("befor subbing margin : ", trade.positionMargin);
  if (trade.positionMargin < order.margin && trade.orderGetProfit == order) {
    order.stat = "canceled";
    trade.orderGetProfit.stat = "canceled";
    return;
    // } else if (trade.orderCloseLoss == order) {
    //   order.stat = "filled";
    //   trade.orderCloseLoss.stat = "filled";
    //   trade.positionMargin = 0;
    //   addOrders(trade, orders, ticker, logs);
    //   return;
  } else if (trade.orderGetProfit == order) {
    order.stat = "filled";
    trade.orderGetProfit.stat = "filled";
    trade.positionMargin = Number(
      (trade.positionMargin - order.margin).toFixed(2)
    );

    // console.log("after subbing margin : " , trade.positionMargin);
    // console.log("sub order = ", order.margin);
    // checkPositionValid(trade, orders);
    // if()
    addOrders(trade, orders, ticker, logs);
    return;
  }
}
