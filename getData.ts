import { Order } from "ccxt";
import { positionLevrage, positionMargin, positionPercent } from "./config";
import { bybit } from "./init";
import { botPostisions, ohlcvData, Orders, Side, Ticker } from "./interfaces";
import { BB } from "./ta";
import { getUnixXHoursAgo } from "./tools";

type OHLCV = [number, number, number, number, number, number];

// let d = bybit.fetchOHLCV("ETHUSDT", "5m", getUnixXHoursAgo(2));
const eth = "ETHUSDT";
export async function getData(timeFrame: string) {
  let time = getRoundDate();
  console.log("time: ", time);

  // let d: OHLCV[] ;
  let hoursAgo = Date.now() / 100;
  // let dateMin1: number = Number((Date.now() / 60 / 1000).toFixed()) * 60;
  // let dateMin15: number =
  //   Number((Date.now() / 60 / 15 / 1000).toFixed()) * 60 * 15;
  // let dateHr1: number =
  //   Number((Date.now() / 60 / 60 / 1000).toFixed()) * 60 * 60;
  // let dateHr4: number =
  //   Number((Date.now() / 60 / 60 / 4 / 1000).toFixed()) * 60 * 60 * 4;
  // let dateD1: number =
  //   Number((Date.now() / 60 / 60 / 24 / 1000).toFixed()) * 60 * 60 * 24;
  // // console.log(dateMin1, dateMin15, dateHr1, dateHr4, dateD1);

  // let hundredAgoMin1 = dateMin1 - 100 * 60;
  // let hundredAgoMin15 = dateMin15 - 100 * 60 * 15;
  // let hundredAgoHr1 = dateHr1 - 100 * 60 * 60;
  // let hundredAgoHr4 = dateHr4 - 100 * 60 * 60 * 4;
  // let hundredAgoD1 = dateD1 - 100 * 60 * 60 * 24;
  // console.log(
  //   hundredAgoMin1,
  //   hundredAgoMin15,
  //   hundredAgoHr1,
  //   hundredAgoHr4,
  //   hundredAgoD1
  // );
  // console.log("Date : ", Date.now());

  // switch (timeFrame) {
  //   case "1m":
  //     hoursAgo = time[0]*1000; // 100 min ago
  //   case "15m":
  //     hoursAgo = time[1]*1000; // 13 hours ago
  //   case "1h":
  //     hoursAgo = time[2]*1000; // 100 hours ago
  //   case "4h":
  //     hoursAgo = time[3]*1000; // 50 days ago
  //   case "1d":
  //     hoursAgo = time[4]*1000; // 400 days ago
  // }
  let d: OHLCV[] = [];
  if (timeFrame == "1m") {
    d = await bybit.fetchOHLCV(
      eth,
      timeFrame,
      time[0]
      // getUnixXHoursAgo(hoursAgo)
      // getUnixBarsAgo(timeFrame)
    );
    console.log("data length : ", d.length);
  } else if (timeFrame == "15m") {
    d = await bybit.fetchOHLCV(
      eth,
      timeFrame,
      time[1]
      // getUnixXHoursAgo(hoursAgo)
      // getUnixBarsAgo(timeFrame)
    );
    console.log("data length : ", d.length);
  } else if (timeFrame == "1h") {
    d = await bybit.fetchOHLCV(
      eth,
      timeFrame,
      time[2]
      // getUnixXHoursAgo(hoursAgo)
      // getUnixBarsAgo(timeFrame)
    );
    console.log("data length : ", d.length);
  } else if (timeFrame == "4h") {
    d = await bybit.fetchOHLCV(
      eth,
      timeFrame,
      time[3]
      // getUnixXHoursAgo(hoursAgo)
      // getUnixBarsAgo(timeFrame)
    );
    console.log("data length : ", d.length);
  } else if (timeFrame == "1d") {
    d = await bybit.fetchOHLCV(
      eth,
      timeFrame,
      time[4]
      // getUnixXHoursAgo(hoursAgo)
      // getUnixBarsAgo(timeFrame)
    );
    console.log("data length : ", d.length);
  } else {
  }
  // console.log("hours : ",hoursAgo);
  // console.log("date : ",timeFrame);
  return convertArrayToTicker(d);
}
export async function getRawData(timeFrame: string) {
  // let d: OHLCV[] ;
  let hoursAgo: number = Date.now();
  switch (timeFrame) {
    case "1m":
      hoursAgo -= 200 * 60 * 1000; // 200 min ago
      // console.log(" 1 min hour ago :", hoursAgo);
      let d: OHLCV[] = await bybit.fetchOHLCV(
        eth,
        timeFrame,
        hoursAgo
        // getUnixXHoursAgo(hoursAgo)
      );
    case "15m":
      hoursAgo -= 200 * 15 * 60 * 1000; // 13 hours ago
    case "1h":
      hoursAgo -= 200 * 60 * 60 * 1000; // 200 hours ago
    case "4h":
      hoursAgo -= 200 * 60 * 60 * 4 * 1000; // 50 days ago
    case "1d":
      hoursAgo -= 200 * 24 * 60 * 60 * 1000; // 400 days ago
  }
  let d: OHLCV[] = await bybit.fetchOHLCV(
    eth,
    timeFrame,
    hoursAgo
    // getUnixXHoursAgo(hoursAgo)
  );

  return d;
}

export function convertArrayToTicker(data: OHLCV[]) {
  let d: Ticker[] = [];
  // let revData = data.reverse();
  // console.log(data);

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    let t = trend(element[4], element[1]);
    // if (bbInfo[i]) {
    //   let hullData: number =
    //     element[2] - bbInfo[i].upper + bbInfo[i].lower - element[3];
    //   if (hullArr.length < 10) {
    //     hullArr.push(hullData);
    //   } else {
    //     hullArr.shift();
    //     hullArr.push(hullData);
    //   }
    // console.log(hullArr);

    d.push({
      timeStamp: String(element[0]),
      open: element[1],
      high: element[2],
      low: element[3],
      close: element[4],
      vol: element[5],
      trend: t,
      highLow: (element[2] - element[3]) * t,
      closeOpen: element[4] - element[1],
      // midBB: bbInfo[i].middle,
      // upperBB: bbInfo[i].upper,
      // lowerBB: bbInfo[i].lower,
      // pbBB: bbInfo[i].pb,
      // highUpper: element[2] - bbInfo[i].upper,
      // lowLower: bbInfo[i].lower - element[3],
      // hull: hullData,
      // hullGreaterAvg10: avrage10(hullArr),
    });
    // }
  }

  // console.log(d);

  return d.reverse();
}
export function convertHistoryToTicker(
  data: {
    timeStamp: string;
    open: string;
    high: string;
    low: string;
    close: string;
    vol: string;
  }[]
) {
  let d: Ticker[] = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    let t = trend(Number(element.close), Number(element.open));
    d.push({
      timeStamp: String(element.timeStamp),
      open: Number(element.open),
      high: Number(element.high),
      low: Number(element.low),
      close: Number(element.close),
      vol: Number(element.vol),
      trend: t,
      highLow: (Number(element.high) - Number(element.low)) * t,
      closeOpen: Number(element.close) - Number(element.open),
    });
  }

  return d.reverse();
}
function getCloses(data: Ticker[]) {
  let d: number[] = [];
  // console.log(data);

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    d.push(Number(element.close));
  }
  // console.log(d);

  return d;
}

function trend(close: number, open: number) {
  let trendSide: 1 | -1;
  if (close > open) {
    trendSide = +1;
  } else trendSide = -1;
  return trendSide;
}
var avg10: number[] = [];

export function avrage10(value: number[]) {
  // console.log("init avg : ", value);

  // if (avg10.length < 10) {
  //   avg10.push(value);
  // } else {
  //   avg10.shift();
  //   avg10.push(value);
  // }
  // console.log("lenght check : ", avg10);
  let sum: number = 0;
  let res = 0;
  if ((value.length = 10)) {
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      sum += element;
    }
    res = sum / value.length;
    // console.log("sum of elements : ", sum);
    // console.log(sum/10);
  }
  return res;
}

export function getRoundDate() {
  const sampleDate = 974709000;
  let nowSeconds = Date.now() / 1000;
  let dayFactor = Math.round((nowSeconds - sampleDate) / (24 * 60 * 60));
  let dayDate = sampleDate + (dayFactor - 100) * 24 * 60 * 60;
  // console.log("day date : ",dayDate);
  let hr4Factor = Math.round((nowSeconds - sampleDate) / (4 * 60 * 60));
  let hr4Date = sampleDate + (hr4Factor - 3) * 4 * 60 * 60;
  // console.log("4hr  date : ",hr4Date);
  let hr1Factor = Math.round((nowSeconds - sampleDate) / (60 * 60));
  let hr1Date = sampleDate + (hr1Factor - 3) * 60 * 60;
  // console.log("1hr date : ",hr1Date);
  let min15Factor = Math.round((nowSeconds - sampleDate) / (15 * 60));
  let min15Date = sampleDate + (min15Factor - 3) * 15 * 60;
  // console.log("15min date : ",min15Date);
  let min1Factor = Math.round((nowSeconds - sampleDate) / 60);
  let min1Date = sampleDate + (min1Factor - 3) * 60;
  // console.log("1min date : ",min1Date);
  return [min1Date, min15Date, hr1Date, hr4Date, dayDate];
}

export function calData(data: Ticker[]) {
  let bbInfo = preBB(data);
  // let d = data;
  for (let i = 0; i < data.length; i++) {
    const bb = bbInfo[i];
    if (bb) {
      const element = data[i];
      element.upperBB = bb.upper;
      element.midBB = bb.middle;
      element.lowerBB = bb.lower;
      element.pbBB = bb.pb;
      element.highUpper = element.high - bb.upper;
      element.lowLower = bb.lower - element.low;
      element.hull = element.highUpper + element.lowLower;

      // element.hullGreaterAvg10 = hullArr.length;
    }
  }
  // return d
}

export function calAvg(ticker: Ticker[]) {
  let hullArr: number[] = [];
  // let avg: number[]= []
  // let revCloses = closes.reverse();
  // let revTicker = ticker.reverse();

  for (let i = 0; i < ticker.length; i++) {
    const element = ticker[ticker.length - i - 1];
    if (element.hull) {
      const hull = Number(element.hull);
      if (hullArr.length < 10) {
        hullArr.push(hull);
      } else {
        hullArr.shift();
        hullArr.push(hull);
      }
    }
    element.hullGreaterAvg10 = avrage10(hullArr);
    // avg.push(avrage10(hullArr))
  }
  // return ticker
}

export function calTrend(data: Ticker[]) {
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element.hull && element.hullGreaterAvg10) {
      if (element.hull > element.hullGreaterAvg10) {
        element.bbTrend = "up";
      } else {
        element.bbTrend = "down";
      }
    }
  }
  // return data
}
export function calOrder(data: Ticker[]) {
  console.log("checking order ...");
  for (let i = data.length - 1; i > 0; i--) {
    // console.log(i);
    const element = data[i];
    if (data[i + 1] && data[i + 2] && data[i + 3]) {
      // console.log("double check order ...");
      if (
        data[i + 1].bbTrend == "up" &&
        data[i + 2].bbTrend == "up" &&
        data[i + 3].bbTrend == "up"
      ) {
        // console.log("adding order ...");
        element.activateOrder = "long";
      } else if (
        data[i + 1].bbTrend == "down" &&
        data[i + 2].bbTrend == "down" &&
        data[i + 3].bbTrend == "down"
      ) {
        // console.log("adding order ...");
        element.activateOrder = "short";
      } else {
        element.activateOrder = data[i + 1].activateOrder;
      }
    }
  }
}
export function calPnL(data: Ticker[]) {
  for (let i = data.length - 1; i > 0; i--) {
    const element = data[i];
    if (element.activateOrder == "long") {
      element.PnL = element.closeOpen;
    } else if (element.activateOrder == "short") {
      element.PnL = -element.closeOpen;
    }
  }
}
export function calTrades(
  data: Ticker[],
  shortPosition: botPostisions,
  longPosition: botPostisions
) {
  let positions: botPostisions[] = [];
  // let shortSize: number = 0;
  // let longSize: number = 0;
  let newEntry: number = 0;
  for (let i = data.length - 1; i > 0; i--) {
    const element = data[i];
    if (data[i + 1] && element.activateOrder != data[i + 1].activateOrder) {
      if (element.activateOrder == "long") {
        if (longPosition.initialMargin == 0) {
          newEntry = element.open;
          longPosition.initialMargin = 0.01;
          longPosition.positionMargin = 0.01;
          longPosition.entryPrice = newEntry;
          longPosition.positionPrice = newEntry;
        } else {
          newEntry = wAverage(
            longPosition.positionPrice,
            longPosition.positionMargin,
            element.open,
            0.01
          );
          longPosition.entryPrice = element.open;
          longPosition.positionPrice = newEntry;
          longPosition.positionMargin += 0.01;
        }
        longPosition.liqPrice = liqPrice(element.open, "long");
      } else if (element.activateOrder == "short") {
        if (shortPosition.initialMargin == 0) {
          newEntry = element.open;
          shortPosition.initialMargin = 0.01;
          shortPosition.positionMargin = 0.01;
          shortPosition.entryPrice = newEntry;
          shortPosition.positionPrice = newEntry;
        } else {
          newEntry = wAverage(
            shortPosition.positionPrice,
            shortPosition.positionMargin,
            element.open,
            0.01
          );
          shortPosition.entryPrice = element.open;
          shortPosition.positionPrice = newEntry;
          shortPosition.positionMargin += 0.01;
        }
        shortPosition.liqPrice = liqPrice(element.open, "short");
      }
    }
  }
  // console.log("long position",longPosition);
  return positions.reverse();
}

export function tradingBoat(
  data: Ticker[],
  long: botPostisions,
  short: botPostisions,
  orders: Orders[]
) {
  for (let i = data.length - 1; i >= 0; i--) {
    const element = data[i];
    if(long.positionMargin == 0 && short.positionMargin == 0 && orders.length == 0){
      // add orders 
      orders.push({
        side: long.side,
        limit: element.close - (element.close / positionLevrage) * positionPercent.l1 ,
        margin: positionMargin,
        stat:"open",
        type:"open Position" ,
        fromPosition:element.close

      })
      orders.push({
        side: short.side,
        limit: element.close + (element.close / positionLevrage) * positionPercent.l1 ,
        margin: positionMargin,
        stat:"open",
        type:"open Position" ,
        fromPosition:element.close

      })
    }else if (orders.length > 0 ){
      for (let or = 0; or < orders.length; or++) {
        const order = orders[or];
        if(order.limit >= element.low && order.limit <= element.high && order.stat == "open"){
          if(order.side == long.side){
            if(order.type == "open Position"){
              // long.positionPrice = wAverage()
            }else if(order.type == "close Position" ){

            }
          }else if (order.side == short.side){

          }
        }
        
      }
    }



    // if (long.positionMargin == 0 , short.positionMargin == 0) {
    //   console.log("init long & short ...");
      
    //   addTrade(long, element.open, 0.01, element.open);
    //   addOrders(orders, long);

    //   addTrade(short, element.open, 0.01, element.open);
    //   addOrders(orders, short);
    //   //set orders
    // } else{
    //   //check orders if activated add to position
    //   // let shortFilled:string // TODO- add shortLoss, shortProfit , longLoss, long Profit to interface
    //   for (let i = 0; i < orders.length; i++) {
    //     let order = orders[i];
    //     if (order.side == "long" && order.stat == "open") {
    //       order.stat = "filled";
    //       if (order.limit > element.low && order.limit < element.high) {
    //         let wavg = wAverage(
    //           long.positionPrice,
    //           long.positionMargin,
    //           order.limit,
    //           order.margin
    //         );
    //         addTrade(long, order.limit, order.margin, wavg);
    //         addOrders(orders, long);
    //       }
    //     }else if (order.side == "short" && order.stat == "open") {
    //       order.stat = "filled";
    //       if (order.limit > element.low && order.limit < element.high) {
    //         let wavg = wAverage(
    //           long.positionPrice,
    //           long.positionMargin,
    //           order.limit,
    //           order.margin
    //         );
    //         addTrade(short, order.limit, order.margin, wavg);
    //         addOrders(orders, short);
    //       }
    //     }
    //   }
    // } 
    // else if (short.positionMargin == 0 && long.positionMargin != 0) {
    //   console.log("init short ...");
      
    //   addTrade(short, element.open, 0.01, element.open);
    //   addOrders(orders, short);
    //   //set orders
    // } else if (short.positionMargin != 0) {
    //   //check orders if activated add to position
    //   for (let i = 0; i < orders.length; i++) {
    //     let order = orders[i];
    //     if (order.side == "short" && order.stat == "open") {
    //       order.stat = "filled";
    //       if (order.limit > element.low && order.limit < element.high) {
    //         let wavg = wAverage(
    //           short.positionPrice,
    //           short.positionMargin,
    //           order.limit,
    //           order.margin
    //         );

    //         addTrade(short, order.limit, order.margin, wavg);
    //         addOrders(orders, short);
    //       }
    //     }
    //   }
    // }
  }
}

function addOrders(orders: Orders[], trade: botPostisions) {
  let order: Orders = {
    limit: 0,
    margin: 0.01,
    side: "init",
    stat: "canceled",
    type : 'open Position',
    fromPosition:0
  };
  if (trade.side == "long") {
    order.side = "long";
    order.stat = "open";
    order.limit =
      trade.positionPrice - (trade.positionPrice / positionLevrage) * 0.3;
    orders.push(order);
    // console.log(order);

    order.limit =
      trade.positionPrice + (trade.positionPrice / positionLevrage) * 0.15;
    orders.push(order);
    // console.log(order);
  } else if (trade.side == "short") {
    order.side = "short";
    order.stat = "open";
    order.limit =
      trade.positionPrice + (trade.positionPrice / positionLevrage) * 0.3;
    orders.push(order);
    // console.log(order);
    order.limit =
      trade.positionPrice - (trade.positionPrice / positionLevrage) * 0.15;
    orders.push(order);
    // console.log(order);
  }
}

function addTrade(
  trade: botPostisions,
  entryPrice: number,
  addMargin: number,
  wavg: number
) {
  if (!trade.entryPrice) {
    trade.entryPrice = entryPrice;
  }
  trade.initialMargin = 0.01;
  trade.positionPrice = wavg;
  trade.positionMargin += addMargin;
  trade.liqPrice = liqPrice(trade.entryPrice, trade.side);
  // console.log("trade added ... ", trade);
}

function liqPrice(entryPrice: number, side: Side) {
  let levrage = positionLevrage;
  let liq = 0;
  if ((side = "long")) {
    liq = -0.95;
  } else {
    liq = 0.95;
  }
  return entryPrice + (entryPrice * liq) / levrage;
}

function wAverage(p1: number, s1: number, p2: number, s2: number) {
  return (p1 * s1 + p2 * s2) / (s1 + s2);
}

function preBB(data: Ticker[]) {
  let closes = getCloses(data);
  let bbInfo = BB(closes);
  return bbInfo;
}
