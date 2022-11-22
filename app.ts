import { BackTest, TradingBot } from "./trade";
import { BotPlan } from "./interfaces";
import { Balance } from "ccxt";
import { weighedPosisionsMid, safezone, say, totalPower } from "./tools";
import {
  getBalances,
  ordersLog,
  printPositions,
  getPosistions,
  printPositionsPro,
} from "./profile";
import { getEthPrice } from "./markets";
import { avrage10, getData, getRawData, getRoundDate } from "./getData";
import { BB, waveRetracement } from "./ta";
import { bybitPro, bybit } from "./init";
import { Balances } from "ccxt";

import { convertArrayToCSV } from "convert-array-to-csv";

import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
import { join } from "path";

// const init = require("./init");

const main = async () => {
  console.log(" ");
  console.log(" ");
  // say([" #####  new fetch ##### "]);

  // await bybit.fetchBalance().then((x) => {
  //   let profileBalance: Balance = x.USDT;
  //   console.log(profileBalance);
  // });

  // getRoundDate();

  // getBalances();
  //   ordersLog();
  //   getEthPrice();
  //   printPositions();
  //   let posistions = await getPosistions();
  //   console.log("weighted price ==>  ", weighedPosisionsMid(posistions));
  // console.log(safezone(await getPosistions()));

  //   totalPower(await getBalances(), await getEthPrice());
  //   //   getData(2);
  // waveRetracement();

  // setInterval(async () => {
  //   await printPositions();
  // }, 60000);
  //   await bybitPro
  //     .setTPSL({
  //       symbol: "ETHUSDT",
  //       takeProfit: "1320.15",
  //       stopLoss: "1000",
  //       positionIdx: 1,
  //     })
  //     .then((x) => console.log(x));

  //   printPositionsPro();

  // printPositions();
  // let data = new TradingBot().findTrend().then((x) =>
  //   // csvExporter.generateCsv( x[0])
  //   // console.log(convertArrayToCSV(x))
  //   {
  //     writeToFile(convertArrayToCSV(x.m1), "1m.csv");
  //     writeToFile(convertArrayToCSV(x.m15), "15m.csv");
  //     writeToFile(convertArrayToCSV(x.h1), "1hr.csv");
  //     writeToFile(convertArrayToCSV(x.h4), "4hr.csv");
  //     writeToFile(convertArrayToCSV(x.d1), "1d.csv");
  //   }
  // );
  //   let data = new TradingBot().findTrend().then((x) =>
  //   // csvExporter.generateCsv( x[0])
  //   // console.log(convertArrayToCSV(x))
  //   {
  //     writeToFile(convertArrayToCSV(x), "trend Data.csv");
  //   }
  // );
  // console.log("4hours raw data : ", await getRawData("4h"));

  // console.log("BB : ", BB(getCloses(await getRawData("4h"))));

  // data.findTrend();
  // console.log(await getRawData("15m"));

  // console.log(await data.findTrend());

  // csvExporter.generateCsv( await data)
  // bybitPro.postPrivate()

  // console.log(
  //   "avg 10 : ",
  //   avrage10([
  //     -19.91, -20.2, -19.43, -15.46, -16.81, -10.65, -13.72, -6.33, 6.94, -2.72,
  //   ])
  // );
  // klinwData().then(x=>{
  //   console.log(x.result.list);

  // });
  // let job = new TradingBot().fetchData().then((x) => writeToFile(convertArrayToCSV(x), "15min one week.csv"));
  // let bot = new TradingBot();
  let backtest = new BackTest();
};

main();

// async function klinwData(){
//   let m15 =await  bybitPro.getCandles({
//     category: "linear",
//     symbol: "ETHUSDT",
//     interval: "1",
//     start: 1668479400,
//     end: Date.now(),})
//     console.log(m15);
//     return m15

// }
