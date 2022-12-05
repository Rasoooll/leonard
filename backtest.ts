import { convertArrayToCSV } from "convert-array-to-csv";
import { parse } from "fast-csv";
import { createReadStream, writeFileSync } from "fs";
import { join } from "path";
import { positionLevrage, positionMargin, positionPercent } from "./config";
import { botPostisions, Orders, Side, Ticker } from "./interfaces";

export class BackTest {
  private results: any[] = [];
  private ticker: Ticker[] = [];
//   private filledOrders: Orders[];
  private orderinit: Orders = {
    pp: 0,
    side: "init",
    type: "close Position",
    limit: 0,
    margin: positionMargin,
    stat: "test",
  };
  public shortPosition: botPostisions = {
    side: "short",
    levrage: positionLevrage,
    initialMargin: 0,
    positionMargin: 0,
    liqPrice: 0,
    positionPrice: 0,
    entryPrice: 0,
    liq: "noLiq",
    pnl: 0,
    orderClose: this.orderinit,
    orderOpen: this.orderinit,
  };
  public longPosition: botPostisions = {
    side: "long",
    levrage: positionLevrage,
    initialMargin: 0,
    positionMargin: 0,
    liqPrice: 0,
    positionPrice: 0,
    entryPrice: 0,
    liq: "noLiq",
    pnl: 0,
    orderClose: this.orderinit,
    orderOpen: this.orderinit,
  };
  private orders: Orders[] = [];
  constructor() {
    let fileNames: string[] = ["historyETH"];
    this.checkHistory(fileNames);
  }
  async writeToFile(data: any, name: string) {
    writeFileSync(join(__dirname, name), data, {
      flag: "w",
    });
    console.log(name + " Got  Done ...");
  }
  checkHistory(filename: string[]) {
    for (let index = 0; index < filename.length; index++) {
      const file: string = filename[index];
      // let results: any[] = [];
      createReadStream("./history/" + file + ".csv")
        .pipe(parse({ headers: true }))
        .on("error", (error) => console.error(error))
        .on("data", (data) => this.results.push(data))
        .on("end", () => {
          // console.log(this.results),
          this.ticker = this.convertHistoryToTicker(this.results);
          // writeToFile(convertArrayToCSV(this.results), "./reports/"+file+"_results.csv");
          this.tradingBoat(this.ticker);
          // console.log((this.ticker));
          console.log("Orders length : ", this.orders.length);

          console.log(file + " Long position : ", this.longPosition);
          console.log(file + " Short position : ", this.shortPosition);

          this.writeToFile(
            convertArrayToCSV(this.orders),
            "./reports/" + file + ".csv"
          );
          this.writeToFile(
            convertArrayToCSV(this.ticker),
            "./reports/" + file + "_check.csv"
          );
        });
    }
  }
  trend(close: number, open: number) {
    let trendSide: 1 | -1;
    if (close > open) {
      trendSide = +1;
    } else trendSide = -1;
    return trendSide;
  }
  convertHistoryToTicker(
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
      // console.log(element);

      if (element) {
        let t = this.trend(Number(element.close), Number(element.open));
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
    }

    return d.reverse();
  }
  tradingBoat(ticker: Ticker[]) {
    for (let el = ticker.length - 1; el >= 0; el--) {
      // let openOrders: Orders[] = [];
      const element = ticker[el];

    //   for (let ord = 0; ord < 10; ord++) {
        if (this.longPosition.positionMargin == 0) {
          console.log("init long ...");
          // add trade to long
          // add both open & close trades to trade and orders
          //   this.addTrade(
          //     this.longPosition,
          //     element.open,
          //     // positionMargin,
          //     this.orderinit,
          //     element.open
          //   );
          this.orderinit.limit = element.close;
          this.orderinit.pp = element.close;
          this.orderinit.side = "long";
          this.orderinit.stat = "open";
          this.orderinit.type = "open Position";
          this.longPosition.orderOpen = this.orderinit;
          this.longPosition.positionPrice = element.close
          this.activeOrder(this.longPosition.orderOpen, this.longPosition);

          //   this.calPnL(this.longPosition, element);
          //set orders
        } 
        if (this.shortPosition.positionMargin == 0) {
          console.log("init short ...");
        //   this.addTrade(
        //     this.shortPosition,
        //     element.open,
        //     // positionMargin,
        //     this.orderinit,
        //     element.open
        //   );
          this.orderinit.limit = element.close;
          this.orderinit.pp = element.close;
          this.orderinit.side = "short";
          this.orderinit.stat = "open";
          this.orderinit.type = "open Position"
          this.shortPosition.orderOpen = this.orderinit;
          this.shortPosition.positionPrice = element.close
          this.activeOrder(this.shortPosition.orderOpen, this.shortPosition);

        } 
          if (
            this.shortPosition.orderOpen.limit > element.low &&
            this.shortPosition.orderOpen.limit < element.high
          ) {
            // this.shortPosition.orderOpen.stat = "test";
            // this.addTrade(
            //   this.shortPosition,
            //   this.wAverage(
            //     this.shortPosition.positionPrice,
            //     this.shortPosition.positionMargin,
            //     this.shortPosition.orderOpen.limit,
            //     this.shortPosition.orderOpen.margin
            //   ),
            //   //   this.shortPosition.orderOpen.margin,
            //   this.shortPosition.orderOpen
            // );
            this.activeOrder(this.shortPosition.orderOpen , this.shortPosition)

            // short.orderOpen.stat = "filled";
          } 
          if (
            this.shortPosition.orderClose.limit > element.low &&
            this.shortPosition.orderClose.limit < element.high
          ) {
            this.activeOrder(this.shortPosition.orderClose , this.shortPosition)
            // this.subTrade(
            //   this.shortPosition,
            //   this.getProfit(this.shortPosition.positionMargin),
            //   this.orders
            // );
            // short.orderOpen.stat = "filled";
          }
          if (
            this.longPosition.orderOpen.limit > element.low &&
            this.longPosition.orderOpen.limit < element.high
          ) {
            // this.addTrade(
            //   this.longPosition,
            //   this.wAverage(
            //     this.longPosition.positionPrice,
            //     this.longPosition.positionMargin,
            //     this.longPosition.orderOpen.limit,
            //     this.longPosition.orderOpen.margin
            //   ),
            //   //   this.longPosition.orderOpen.margin
            //   this.longPosition.orderOpen
            // );

            this.activeOrder(this.longPosition.orderOpen , this.longPosition)
            // long.orderOpen.stat = "filled";
          } 
          if (
            this.longPosition.orderClose.limit > element.low &&
            this.longPosition.orderClose.limit < element.high
          ) {
            this.activeOrder(this.longPosition.orderClose , this.longPosition)
            // this.subTrade(
            //   this.longPosition,
            //   this.getProfit(this.shortPosition.positionMargin),
            //   this.orders
            // );
            //   isLiqiadated(long, element);
            //   isLiqiadated(short, element);
          }
        

        this.calPnL(this.longPosition, element);
        this.calPnL(this.shortPosition, element);
      }
    //   element.longPrice = this.longPosition.positionPrice;
    //   element.longSize = this.longPosition.positionMargin;
    //   element.shortPrice = this.shortPosition.positionPrice;
    //   element.shortSize = this.shortPosition.positionMargin;
    // }
  }

  activeOrder(order: Orders, trade: botPostisions) {
    if (order.side == trade.side) {
      if (order.type == "open Position") {
        // add order to orders
        order.stat = "filled";
        this.orders.push(order);
        trade.positionPrice = this.wAverage(
          trade.positionPrice,
          trade.positionMargin,
          order.limit,
          order.margin
        );
        trade.liqPrice = this.liqPrice(trade.positionPrice, trade.side);
        trade.positionMargin += order.margin;
        trade.orderOpen = this.martinLoss(trade);
        trade.orderClose = this.takeProfit(trade);

        // change trade prop
        //
      }else if(order.type == "close Position"){
        
        order.stat = "filled";
        this.orders.push(order);
        trade.positionMargin -= order.margin;
        trade.orderOpen = this.martinLoss(trade);
        trade.orderClose = this.takeProfit(trade);

      }
    }
  }
  addTrade(
    trade: botPostisions,
    wavg: number,
    order: Orders,
    // addMargin: number,
    // orders:Orders[],
    entryPrice?: number
  ) {
    if (entryPrice) {
      trade.entryPrice = entryPrice;
      trade.initialMargin = positionMargin;
    }
    // if()
    trade.positionPrice = wavg;
    trade.positionMargin += positionMargin;
    trade.liqPrice = this.liqPrice(trade.positionPrice, trade.side);
    // order.stat = "filled";
    // this.orders.push(order)
    // orders.push(trade.orderOpen)
    trade.orderOpen = this.martinLoss(trade);
    trade.orderClose = this.takeProfit(trade);

    // addOrders(orders, trade);
    // console.log("trade added ... ", trade);
  }
  subTrade(trade: botPostisions, subMargin: number, orders: Orders[]) {
    // if (trade.positionMargin - subMargin >= positionMargin) {
    trade.positionMargin -= positionMargin;
    trade.orderOpen = this.martinLoss(trade);
    trade.orderClose = this.takeProfit(trade);
    // orders.push(trade.orderOpen);
    // orders.push(trade.orderClose);
    // afterSubOrders(orders, trade);
    // }
  }
  takeProfit(trade: botPostisions) {
    let order: Orders = {
      type: "close Position",
      pp: trade.positionPrice,
      limit: this.calLimit(
        trade.positionPrice,
        positionPercent.L2GetFromProfit,
        "profit",
        trade.side
      ),
      margin: positionMargin,
      side: trade.side,
      stat: "open",
    };
    return order;
  }

  martinLoss(trade: botPostisions) {
    let order: Orders = {
      type: "open Position",
      pp: trade.positionPrice,
      limit: this.calLimit(
        trade.positionPrice,
        positionPercent.L2AddOnLoss,
        "loss",
        trade.side
      ),
      margin: positionMargin,
      side: trade.side,
      stat: "open",
    };
    return order;
  }

  calLimit(
    positionPrice: number,
    profitLossPercent: number,
    pnls: "loss" | "profit",
    side: Side
  ) {
    let a = 0;
    if (pnls == "loss") {
      if (side == "long") {
        a =
          positionPrice - (positionPrice / positionLevrage) * profitLossPercent;
      } else if (side == "short") {
        a =
          positionPrice + (positionPrice / positionLevrage) * profitLossPercent;
      }
    } else if (pnls == "profit") {
      if (side == "long") {
        a =
          positionPrice + (positionPrice / positionLevrage) * profitLossPercent;
      } else if (side == "short") {
        a =
          positionPrice - (positionPrice / positionLevrage) * profitLossPercent;
      }
    }
    // console.log(" limit calculated : " , a);

    return Number(a.toFixed(2));
  }
  getProfit(margin: number) {
    let m = 0.01;
    // if (margin > positionMargin * 5) {
    //   m = margin;
    // } else {
    //   m = positionMargin;
    // }
    // m = Number(m.toFixed(2));
    // console.log(m);

    return m;
  }
  wAverage(p1: number, s1: number, p2: number, s2: number) {
    return Number(((p1 * s1 + p2 * s2) / (s1 + s2)).toFixed(2));
  }
  calPnL(trade: botPostisions, ticker: Ticker) {
    if (trade.positionMargin >= positionMargin) {
      if (trade.side == "long") {
        trade.pnl = (ticker.close - trade.positionPrice) * trade.positionMargin;
        ticker.PnL_Long = trade.pnl;
        ticker.PnL_LongSize = trade.positionMargin;
      } else if (trade.side == "short") {
        trade.pnl = (trade.positionPrice - ticker.close) * trade.positionMargin;
        ticker.PnL_Short = trade.pnl;
        ticker.PnL_ShortSize = trade.positionMargin;
      }
      this.calPnlp(ticker);
      console.log(ticker.PnL_LongSize);
    }
  }

  calPnlp(ticker: Ticker) {
    let pnlp = 0;
    if (ticker.PnL_Long) {
      pnlp += ticker.PnL_Long;
    }
    if (ticker.PnL_Short) {
      pnlp += ticker.PnL_Short;
    }
    ticker.PNLp = pnlp;
  }
  liqPrice(entryPrice: number, side: Side) {
    let levrage = positionLevrage;
    let liq = 0.95;
    let liqPrice = 0;
    if (side == "long") {
      // liq = -0.95;
      liqPrice = entryPrice - (entryPrice * liq) / levrage;
      // console.log("long liq price : ", liqPrice);
    } else if (side == "short") {
      liqPrice = entryPrice + (entryPrice * liq) / levrage;
      // console.log("short liq price : ", liqPrice);
    }
    return Number(liqPrice.toFixed(2));
  }
}
