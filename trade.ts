import { Axios } from "axios";
import { Balance } from "ccxt";
import {
  ccxtBybitPositions,
  ProfileData,
  ohlcvData,
  Trends,
  Ticker,
  BBTrend,
  botPostisions,
  Orders,
  TradeLog,
  TradeTest,
} from "./interfaces";

import csvParser from "csv-parser";
import { parse } from "fast-csv";
import { createReadStream, readFileSync, writeFileSync } from "fs";
// import { bybit } from "./init";
// using bollinger band we can place a money managment system to trade automatically
// levrage 20
// if price crossed the upper bb we place a sell order
// and set 3 orders behind entry price based on upper bb
// when price  is over upper bb getNewBB() , and calculate l1 entry from position entry : 10% ,
//
//  if price crossed lower bb place a buy order

// when upper bb 5min is over 30 min upper bb wait and sell when price is below 30 min upper bb
// when lower
// when short position { if  }

// when 5min bb lower is under 30 min lower bb wait and buy when price is ablove 30 min lower bb

// variables :
// small bb upper , mid , lower / larg bb : upper lower mid / reEntry conidtions / entry condistion / exit condition

import { bybit } from "./init";
import { OHLCV } from "ccxt";
import { getPosistions, usdtbalance } from "./profile";
import {
  calAvg,
  calData,
  calOrder,
  calPnL,
  calTrades,
  calTrend,
  convertArrayToTicker,
  convertHistoryToTicker,
  getData,
  getRawData,
  getRoundDate,
  tradingBoat,
} from "./getData";
import { convertArrayToCSV } from "convert-array-to-csv";
import { join } from "path";
import { positionLevrage } from "./config";
import { BotLog, TradingBot } from "./tradingShipApp/tradingShip";

interface BBinterface {
  name: string;
  timeStamp: Date;
  upperBand: number;
  midBand: number;
  loweBand: number;
}
// class BB {
//     // private bBand:BBinterface;
//     constructor ( ){
//         bybit.
//     }

// }

// function getBB(){
//     let
//     return bb;
// }

//when wave[0] < wave[1] expect

// open 2 trades in both directions
// set orders on x% loss each and set y% order in profit each
//( levrage 50 => )
// if both in profit or sum of both profits = money invested close both positions
// minimum size be calculated based on power
// when position in profit orders will be placed on fibo-percents-profit
// and size will be position size/2 or minimum size

// when position in loss orders will be placed on fibo-percent-loss
// and size will be position size

export function startBot() {
  // open 2 positions in diffrent sides
  // +5% price for short and -5% for long
  // get price now
  // check if price is going down or up
  // in trend direction palce 3 order on last price , lp+5% , lp-5% in trend direction
  // wait until one is activated
  // then place 3 orders :(from function that gets level based on positions/power)
  // 1) +10 or l1/l2/l3/l4 profit same direction  1/2 position size
  // 2) +20% or l1/l2/l3/l4 profit oposite direction 1 position size
  // 3) -20& or l1/l2/l3/l4 loss oposite direction 1 position size
  // until sum profit positions  = x or percent of initial margins
  // if no open position start over
}

export function placeOrder() {
  // check price , if in fibo-profit or fibo-loss place order
}

export function getLevrage() {
  // get levrage for calculating prices based on position size
}

export function checkPNL() {
  // check if both pnls are = double total position size => exit both with profit
  // if size each > min-size
  // close all but keep min size
}

export function minOpenSize() {
  //calculate min-order based on power
}
const eth = "ETHUSDT";

export class TradingBotOne {
  // vars
  //   private balance: Balance;
  //   private positions: ccxtBybitPositions[];
  //   private marketData: ohlcvData;

  // get data
  async getBalance() {
    let balance: Balance = await usdtbalance();
    return balance;
  }

  async getPositions() {
    let positions: ccxtBybitPositions[] = await getPosistions();
    return positions;
  }

  async getOLHCV() {
    let marketData: ohlcvData = {
      m1: convertArrayToTicker(await bybit.fetchOHLCV(eth, "1m")),
      m15: convertArrayToTicker(await bybit.fetchOHLCV(eth, "15m")),
      h1: convertArrayToTicker(await bybit.fetchOHLCV(eth, "1h")),
      h4: convertArrayToTicker(await bybit.fetchOHLCV(eth, "4h")),
      d1: convertArrayToTicker(await bybit.fetchOHLCV(eth, "1d")),
    };
    calData(marketData.m1);
    calData(marketData.m15);
    calData(marketData.h1);
    calData(marketData.h4);
    calData(marketData.d1);

    calAvg(marketData.m1);
    calAvg(marketData.m15);
    calAvg(marketData.h1);
    calAvg(marketData.h4);
    calAvg(marketData.d1);

    calTrend(marketData.m1);
    calTrend(marketData.m15);
    calTrend(marketData.h1);
    calTrend(marketData.h4);
    calTrend(marketData.d1);
    return marketData;
  }

  // find trend
  async findTrend() {
    let pricedata = await this.getOLHCV();
    // let trends: Trends[] = this.getTrends(pricedata);

    // console.log( (await this.getOLHCV()).m1 );
    return pricedata;
  }
  //   getTrends(data: ohlcvData) {
  //     let arr: Trends[] = [];
  //     // let num : number[]=[];
  //     // let str:string[]=[];
  //     for (let i = 0; i < data.m1.length; i++) {
  //       const elementM1 = data.m1[i];
  //       const elementM15 = data.m15[i];
  //       const elementH1 = data.h1[i];
  //       const elementH4 = data.h4[i];
  //       const elementD1 = data.d1[i];
  //       if (elementM1.bbTrend && elementM1.closeOpen) {
  //         arr.push({
  //           m1: elementM1.bbTrend,
  //           m1CloseOpen: elementM1.closeOpen,
  //           m15: elementM15.bbTrend,
  //           m15CloseOpen: elementM15.closeOpen,
  //           h1: elementH1.bbTrend,
  //           h1CloseOpen: elementH1.closeOpen,
  //           h4: elementH4.bbTrend,
  //           h4CloseOpen: elementH4.closeOpen,
  //           d1: elementD1.bbTrend,
  //           d1CloseOpen: elementD1.closeOpen,
  //         });
  //       }
  //     }
  //     return arr;
  //   }
  getClosOpen(ticker: Ticker[]) {
    let arr: number[] = [];
    for (let i = 0; i < ticker.length; i++) {
      const element = ticker[i];
      if (element.bbTrend) {
        arr.push(element.closeOpen);
      }
    }
    return arr;
  }

  async fetchData() {
    let x = convertArrayToTicker(
      await bybit.fetchOHLCV(eth, "15m", 1608479400000)
    );
    return x;
  }
}
async function writeToFile(data: any, name: string) {
  writeFileSync(join(__dirname, name), data, {
    flag: "w",
  });
  console.log(name + " Got  Done ...");
}
export class BackTest {
  private results: any[] = [];
  private ticker: Ticker[] = [];
  private tradeTest:TradeTest[] = []
  constructor() {
    // createReadStream("./history.csv")
    //   .pipe(parse({ headers: true }))
    //   .on("error", (error) => console.error(error))
    //   .on("data", (data) => this.results.push(data))
    //   .on("end", () => {
    //     // console.log(results),
    //     this.ticker = convertHistoryToTicker(this.results);
    //     // console.log(ticker);
    //     calData(this.ticker);
    //     calAvg(this.ticker);
    //     calTrend(this.ticker);
    //     calOrder(this.ticker);
    //     calPnL(this.ticker);
    //     let trades: botPostisions[] = calTrades(this.ticker , this.shortPosition , this.longPosition);
    //     // console.log((this.ticker));
    //     console.log("Long position : " , this.longPosition);
    //     console.log("Long position : " , this.shortPosition);

    //     writeToFile(convertArrayToCSV(this.ticker), "history_check.csv");
    //     writeToFile(convertArrayToCSV(trades), "history_trades.csv");
    //   });
    createReadStream("./history/historyETH.csv")
      .pipe(parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (data) => this.results.push(data))
      .on("end", () => {
        // console.log(results),
        this.ticker = convertHistoryToTicker(this.results);
        // console.log(this.ticker);
        // new TradingBot(0.01,30,0.3,0.9,0.95).tradingShip(this.ticker)
        // tradingShip(
        //   this.longPosition,
        //   this.shortPosition,
        //   this.orders,
        //   this.ticker,
        //   this.tradeLogs,
        //   0.01,20,0.3,0.9,0.95
        // );
        this.tradeTest =  new BotLog(this.ticker).start();
          // let test = new BotLog(this.ticker).test();
        // console.log((this.ticker));
        // console.log("Orders : ", this.orders.length);

        // console.log("Long position : ", this.longPosition);
        // console.log("Short position : ", this.shortPosition);
        // console.log("Orders:" ,this.orders);
        

        // writeToFile(convertArrayToCSV(this.ticker), "./reports/historyETH_check.csv");
        // writeToFile(convertArrayToCSV(this.tradeLogs), "./reports/historyETH_Trades.csv");
        // writeToFile(convertArrayToCSV(this.orders), "./reports/historyETH_Orders.csv");
        // writeToFile(convertArrayToCSV(trades), "history_trades.csv");
        writeToFile(
          convertArrayToCSV(this.tradeTest),
          "./reports/historyETH_AllPosible.csv"
        );
        // writeToFile(
        //   convertArrayToCSV(test.),
        //   "./reports/historyETH_AllPosible.csv"
        // );
        
      });
  }

}
