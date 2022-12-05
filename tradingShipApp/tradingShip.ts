import { TradeTest } from "./../interfaces";
import { botPositionPercent } from "./../config";
import { positionMargin, positionLevrage, positionPercent } from "../config";
import { botPostisions, Orders, Side, Ticker, TradeLog } from "../interfaces";
import { convertArrayToCSV } from "convert-array-to-csv";
import { writeFileSync } from "fs";
import { join } from "path";

export class TradingBot {
  private maxLongPosition:number = 0;
  private maxShortPosition:number = 0;
  constructor(
    private marginInit: number,
    private levrageInit: number,
    private addPricePercent: number,
    private getPricePercent: number,
    private closePricePercent: number
  ) {}
  public orders: Orders[] = [];
  private logs: TradeLog[] = [];
  private initOrder: Orders = {
    side: "init",
    limit: 0,
    margin: 0,
    stat: "open",
    type: "open Position",
    fromPosition: 0,
  };
  public short: botPostisions = {
    side: "short",
    levrage: this.levrageInit,
    level: 0,
    initialMargin: 0,
    positionMargin: 0,
    liqPrice: 0,
    positionPrice: 0,
    entryPrice: 0,
    orderOnLoss1: this.initOrder,
    orderGetProfit: this.initOrder,
    orderCloseLoss: this.initOrder,
  };
  public long: botPostisions = {
    side: "long",
    levrage: this.levrageInit,
    level: 0,
    initialMargin: 0,
    positionMargin: 0,
    liqPrice: 0,
    positionPrice: 0,
    entryPrice: 0,
    orderOnLoss1: this.initOrder,
    orderGetProfit: this.initOrder,
    orderCloseLoss: this.initOrder,
  };

  private cal = new Cal(
    this.marginInit,
    this.levrageInit,
    this.addPricePercent,
    this.getPricePercent,
    this.closePricePercent
  );
  private position = new Position(
    this.marginInit,
    this.levrageInit,
    this.addPricePercent,
    this.getPricePercent,
    this.closePricePercent,
    this.cal
  );
  private order = new Order(
    this.marginInit,
    this.levrageInit,
    this.addPricePercent,
    this.getPricePercent,
    this.closePricePercent,
    this.position,
    this.cal
  );
  tradingShip(data: Ticker[]) {
    for (let d = data.length - 2; d >= 0; d--) {
      const lastElement = data[d + 1];
      const element = data[d];
      // console.log("initilizing ...");
      // console.log(d + "/1600 is checked");

      this.order.initAll(this.long, this.short, lastElement.close, this.orders);
      // for (let index = 0; index < orders.length; index++) {
      //   const order = orders[index];
      this.order.checkCheckAll(this.orders, element, this.long, this.logs);
      this.order.checkCheckAll(this.orders, element, this.short, this.logs);

      // }
      this.cal.Pnl(this.long, element);
      this.cal.Pnl(this.short, element);
      if(this.long.positionMargin > this.maxLongPosition){
        this.maxLongPosition = this.long.positionMargin
      }
      if(this.short.positionMargin > this.maxLongPosition){
        this.maxShortPosition = this.short.positionMargin
      }

    }
    let sum = this.cal.Profits(this.logs);
    let lastTicker = data[0];
    let longPnl =0
    let shortPnl = 0
    if(this.long.positionMargin != 0){
      longPnl = this.cal.Pnl(this.long, lastTicker);
    }
    if(this.short.positionMargin != 0 ){
      shortPnl = this.cal.Pnl(this.short, lastTicker);
    }

    // longPnl += lastTicker.longPnl;

    // if (lastTicker.longPnl) {
    // } else if (lastTicker.shortPnl) {
    //   shortPnl += lastTicker.shortPnl;
    // }
    if (sum[0] > 500) {
      console.log(
        `Total profit : ${sum[2].toFixed(2)} , 
          Total loss : ${sum[3].toFixed(2)} , 
          Total : ${sum[0].toFixed(2)} , 
          Long Pnl: ${longPnl.toFixed(2)} , 
          Short Pnl: ${shortPnl.toFixed(2)}`
      );
    }

    // TODO position long and short margins on report , max margin,
    // console.log("Long position : ", this.long);
    // console.log("Short position : ", this.short);

    return {
      report: sum,
      order: this.orders,
      log: this.logs,
      longpnl: longPnl,
      shortpnl: shortPnl,
      longMargin: this.long.positionMargin,
      shortMargin: this.short.positionMargin,
      maxLMargin:this.maxLongPosition,
      maxSMargin:this.maxShortPosition
    };
  }
}

class Order {
  constructor(
    private margin: number,
    private levrage: number,
    private addP: number,
    private getP: number,
    private closeP: number,
    private position: Position,
    private cal: Cal
  ) {
    // console.log("vals from order : " , [this.margin , this.levrage , this.addP , this.getP , this.closeP]);
  }
  add(
    trade: botPostisions,
    orders: Orders[],
    ticker: Ticker,
    logs: TradeLog[]
  ) {
    // console.log("add order ...");

    // if (checkPositionValid(trade,orders)) {
    new Log().add(trade, ticker, logs);
    this.isValid(trade, orders);
    orders.push(this.cal.lossLimits(trade)[0]);
    trade.orderOnLoss1 = this.cal.lossLimits(trade)[0];
    orders.push(this.cal.lossLimits(trade)[1]);
    trade.orderCloseLoss = this.cal.lossLimits(trade)[1];
    orders.push(this.cal.profitLimits(trade));
    trade.orderGetProfit = this.cal.profitLimits(trade);
    // }
    return;
  }
  isValid(trade: botPostisions, orders: Orders[]) {
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      if (
        order.fromPosition != trade.positionPrice &&
        (order.stat = "open") &&
        order.side == trade.side
      ) {
        order.stat = "canceled";
      }
    }
    if (trade.positionMargin == 0) {
      trade.orderCloseLoss.stat = "canceled";
      trade.orderGetProfit.stat = "canceled";
      trade.orderOnLoss1.stat = "canceled";
    }
  }
  isActive(order: Orders, trade: botPostisions, ticker: Ticker) {
    if (order.stat == "open" && trade.side == order.side) {
      if (order.limit >= ticker.low && order.limit <= ticker.high) {
        // console.log("valid...");

        return true;
      } else {
        return false;
      }
    } else {
      // console.log("not valid ...");

      return false;
    }
  }
  checkOne(
    trade: botPostisions,
    order: Orders,
    ticker: Ticker,
    orders: Orders[],
    logs: TradeLog[]
  ) {
    if (this.isActive(order, trade, ticker) && order.type == "open Position") {
      // console.log("opening position...");

      if (trade.positionMargin < this.margin) {
        // console.log("initing position...");

        this.position.init(trade, order, orders, ticker, logs);
        // return;
      } else if (trade.positionMargin > 0) {
        // console.log("adding position...");
        this.position.add(trade, order, orders, ticker, logs);
        // return;
      }
    } else if (
      this.isActive(order, trade, ticker) &&
      order.type == "close Position" &&
      trade.positionMargin >= order.margin
    ) {
      // console.log("closing position...");
      // console.log("subbing position...");
      this.position.sub(trade, order, orders, ticker, logs);
      // return;
    }
  }
  checkCheckAll(
    orders: Orders[],
    ticker: Ticker,
    trade: botPostisions,
    logs: TradeLog[]
  ) {
    // console.log("checking open orders ...");
    this.checkOne(trade, trade.orderOnLoss1, ticker, orders, logs);
    this.checkOne(trade, trade.orderCloseLoss, ticker, orders, logs);
    this.checkOne(trade, trade.orderGetProfit, ticker, orders, logs);
  }
  initAll(
    long: botPostisions,
    short: botPostisions,
    close: number,
    orders: Orders[]
  ) {
    let percent = this.addP;
    let from = close;
    let margin = this.margin;
    if (long.positionMargin == 0 && long.entryPrice == 0) {
      if (short.positionMargin != 0) {
        long.entryPrice = short.positionPrice;
        from = long.positionPrice;
        percent = this.addP;
        margin = this.cal.num(short.positionMargin / 2);
      }
      long.entryPrice = from;
      // console.log("init order long ...");
      let lower = this.cal.num(from - (from / this.levrage) * percent);
      // console.log(lower);

      orders.push(this.initOne(long, lower, from, margin));
      long.orderOnLoss1 = this.initOne(long, lower, from, margin);
    }
    if ((short.positionMargin == 0, short.entryPrice == 0)) {
      if (long.positionMargin != 0 && short.entryPrice == 0) {
        from = short.positionPrice;
        percent = this.addP;
        margin = this.cal.num(long.positionMargin / 2);
      }
      short.entryPrice = from;
      // console.log("init order short ...");
      let upper = this.cal.num(from + (from / this.levrage) * percent);

      orders.push(this.initOne(short, upper, from, margin));
      short.orderOnLoss1 = this.initOne(short, upper, from, margin);
    }
    // console.log(long,short);
  }
  initOne(trade: botPostisions, limit: number, from: number, margin: number) {
    let order: Orders = {
      side: trade.side,
      limit: limit,
      margin: margin,
      stat: "open",
      type: "open Position",
      fromPosition: from,
    };
    return order;
  }
  refresh() {
    let initOrder: Orders = {
      side: "init",
      limit: 0,
      margin: 0,
      stat: "open",
      type: "open Position",
      fromPosition: 0,
    };
    return initOrder;
  }
}

class Cal {
  constructor(
    private margin: number,
    private levrage: number,
    private addP: number,
    private getP: number,
    private closeP: number
  ) {}
  Profits(logs: TradeLog[]) {
    let profits: number = 0;
    let losses: number = 0;
    let p: number = 0;
    let pp: number = 0;
    let pSum: number = 0;
    let ppSum: number = 0;
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (
        log.gopType == "close Position" &&
        log.gopStat == "filled" &&
        log.pSide == "long"
      ) {
        p = (log.gopLimit - log.gopFrom) * log.gopMargin;
        pp = (p / log.gopFrom) * positionLevrage;
        profits += p;
        log.pnl = p;
        log.pnlp = pp;
        pSum += p;
        ppSum += pp;
      } else if (
        log.gopType == "close Position" &&
        log.gopStat == "filled" &&
        log.pSide == "short"
      ) {
        p = (log.gopFrom - log.gopLimit) * log.gopMargin;
        pp = (p / log.gopFrom) * positionLevrage;
        profits += p;
        log.pnl = p;
        log.pnlp = pp;
        pSum += p;
        ppSum += pp;
      } else if (
        log.colType == "close Position" &&
        log.colStat == "filled" &&
        log.pSide == "long"
      ) {
        p = (log.colLimit - log.colFrom) * log.colMargin;
        pp = (p / log.colFrom) * positionLevrage;
        losses += p;
        log.pnl = p;
        log.pnlp = pp;
        pSum += p;
        ppSum += pp;
      } else if (
        log.colType == "close Position" &&
        log.colStat == "filled" &&
        log.pSide == "short"
      ) {
        p = (log.colFrom - log.colLimit) * log.colMargin;
        pp = (p / log.colFrom) * positionLevrage;
        losses += p;
        log.pnl = p;
        log.pnlp = pp;
        pSum += p;
        ppSum += pp;
      }
    }

    return [pSum, ppSum, profits, losses];
  }
  Pnl(trade: botPostisions, ticker: Ticker) {
    let p: number = 0;
    let pp: number = 0;
    if (trade.side == "long") {
      p = ticker.close - trade.positionPrice;
      pp = (p / trade.positionPrice) * this.levrage;
      ticker.longPrice = trade.positionPrice;
      ticker.longMargin = trade.positionMargin;
      ticker.longPnl = Number(pp.toFixed(2));
      // ticker.longOrderAdd = trade
      // return;
    } else {
      p = trade.positionPrice - ticker.close;
      pp = (p / trade.positionPrice) * this.levrage;
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
      ticker.boat = this.wavg(
        ticker.longPnl,
        ticker.longMargin,
        ticker.shortPnl,
        ticker.shortMargin
      );
    }
    return p;
  }
  wavg(p1: number, s1: number, p2: number, s2: number) {
    let avg = Number(((p1 * s1 + p2 * s2) / (s1 + s2)).toFixed(2));
    return avg;
  }
  profitLimits(trade: botPostisions) {
    let margin = trade.positionMargin;
    let upper = this.upper(trade, this.getP);
    let lower = this.lower(trade, this.getP);
    // if (trade.positionMargin > positionMargin * 20 && trade.positionMargin < positionMargin * 200) {
    //   // margin = Number((trade.positionMargin / 5).toFixed(2)) * 4;
    //   margin = trade.positionMargin
    // } else if(trade.positionMargin > positionMargin * 200 ){
    //   margin = trade.positionMargin
    // }
    if (margin == 0) {
      upper = 0;
      lower = 0;
    }
    if (trade.side == "long") {
      let order: Orders = {
        side: trade.side,
        limit: upper,
        margin: margin,
        stat: "open",
        type: "close Position",
        fromPosition: trade.positionPrice,
      };
      return order;
    } else {
      let order: Orders = {
        side: trade.side,
        limit: lower,
        margin: margin,
        stat: "open",
        type: "close Position",
        fromPosition: trade.positionPrice,
      };
      return order;
    }
  }
  lossLimits(trade: botPostisions) {
    let margin1 = this.margin;
    let margin3 = this.num(trade.positionMargin);
    let upper1 = this.upper(trade, this.addP);
    // console.log("long limid = ",upper1);

    let lower1 = this.lower(trade, this.addP);
    let upper2 = this.upper(trade, this.closeP);
    let lower2 = this.lower(trade, this.closeP);
    // if (margin3 > positionMargin * 8 && margin3 < positionMargin * 200) {
    //   margin1 = Number((trade.positionMargin / 4).toFixed(2));
    //   // margin3 = trade.positionMargin - margin1;
    // }
    if (margin3 == 0) {
      upper2 = 0;
      lower2 = 0;
    }
    // console.log("onLoss : " + margin1 + " & close loss : " + margin3);

    if (trade.side == "long") {
      let order1: Orders = {
        side: trade.side,
        limit: lower1,
        margin: margin1,
        stat: "open",
        type: "open Position",
        fromPosition: trade.positionPrice,
      };
      let orderCloseLoss: Orders = {
        side: trade.side,
        limit: lower2,
        margin: margin3,
        stat: "open",
        type: "close Position",
        fromPosition: trade.positionPrice,
      };
      return [order1, orderCloseLoss];
    } else {
      let order1: Orders = {
        side: trade.side,
        limit: upper1,
        margin: margin1,
        stat: "open",
        type: "open Position",
        fromPosition: trade.positionPrice,
      };

      let orderCloseLoss: Orders = {
        side: trade.side,
        limit: upper2,
        margin: margin3,
        stat: "open",
        type: "close Position",
        fromPosition: trade.positionPrice,
      };
      return [order1, orderCloseLoss];
    }
  }

  upper(trade: botPostisions, percent: number) {
    return Number(
      (
        trade.positionPrice +
        (trade.positionPrice / this.levrage) * percent
      ).toFixed(2)
    );
  }
  lower(trade: botPostisions, percent: number) {
    return Number(
      (
        trade.positionPrice -
        (trade.positionPrice / this.levrage) * percent
      ).toFixed(2)
    );
  }
  liqPrice(entryPrice: number, side: Side) {
    let liq = 0;
    if (side == "long") {
      liq = -0.95;
    } else {
      liq = 0.95;
    }
    let liqP = Number(
      (entryPrice + (entryPrice * liq) / this.levrage).toFixed(2)
    );
    return liqP;
  }
  num(num: number) {
    let n = Number(num.toFixed(2));
    return n;
  }
}
class Position {
  constructor(
    private margin: number,
    private levrage: number,
    private addP: number,
    private getP: number,
    private closeP: number,
    private cal: Cal
  ) {}
  private order = new Order(
    this.margin,
    this.levrage,
    this.addP,
    this.getP,
    this.closeP,
    this,
    this.cal
  );
  sub(
    trade: botPostisions,
    order: Orders,
    orders: Orders[],
    ticker: Ticker,
    logs: TradeLog[]
  ) {
    // console.log("subbing from account");

    if (order == trade.orderCloseLoss) {
      trade.orderCloseLoss.stat = "filled";
    } else if (order == trade.orderGetProfit) {
      trade.orderGetProfit.stat = "filled";
    }
    if (trade.positionMargin == order.margin) {
      trade.level = 0;
      trade.positionMargin = 0;
      trade.entryPrice = 0;
    } else if (trade.positionMargin > order.margin) {
      trade.level = Number(
        (
          (trade.level * (trade.positionMargin - order.margin)) /
          trade.positionMargin
        ).toFixed()
      );
      trade.positionMargin = this.cal.num(trade.positionMargin - order.margin);
    }
    order.stat = "filled";
    this.order.add(trade, orders, ticker, logs);
    return;
  }
  add(
    trade: botPostisions,
    order: Orders,
    orders: Orders[],
    ticker: Ticker,
    logs: TradeLog[]
  ) {
    // console.log("add position ...");
    if (order == trade.orderOnLoss1) {
      trade.orderOnLoss1.stat = "filled";
    }
    order.stat = "filled";
    trade.positionMargin = this.cal.num(trade.positionMargin + order.margin);
    trade.entryPrice = order.limit;
    // console.log("add  margin : ", trade.positionMargin);
    trade.positionPrice = this.cal.wavg(
      trade.positionPrice,
      trade.positionMargin,
      order.limit,
      order.margin
    );
    trade.level += 1;
    trade.liqPrice = this.cal.liqPrice(trade.positionPrice, trade.side);
    this.order.add(trade, orders, ticker, logs);
    return;
  }
  isLiquidated(trade: botPostisions, ticker: Ticker) {
    if (ticker.longPnl && ticker.longPnl <= -1) {
      //liq position
    }
  }
  init(
    trade: botPostisions,
    order: Orders,
    orders: Orders[],
    ticker: Ticker,
    logs: TradeLog[]
  ) {
    // console.log("init position ...");

    trade.entryPrice = order.limit;
    trade.initialMargin = order.margin;
    trade.positionMargin += order.margin;
    trade.positionPrice = order.limit;
    trade.liqPrice = this.cal.liqPrice(trade.positionPrice, trade.side);
    order.stat = "filled";
    trade.orderOnLoss1.stat = "filled";
    // console.log("init margin : " , trade.positionMargin);

    this.order.add(trade, orders, ticker, logs);
    return;
  }
  isValid(trade: botPostisions, orders: Orders[]) {
    if (trade.positionMargin == 0 && trade.positionPrice != 0) {
      trade.liqPrice = 0;
      trade.orderOnLoss1 = this.order.refresh();
      trade.positionPrice = 0;
      trade.level = 0;
      trade.initialMargin = 0;
      trade.liqPrice = 0;
      for (let index = 0; index < orders.length; index++) {
        const order = orders[index];
        if (order.stat == "open" && order.side == trade.side) {
          order.stat = "canceled";
        }
      }
      return true;
    } else {
      return false;
    }
  }
  checkLevel(trade: botPostisions) {
    if (trade.level == 0) {
      //init
    } else if (trade.level > 1 && trade.level < 9) {
      //
    }
  }
}
class Log {
  add(trade: botPostisions, ticker: Ticker, logs: TradeLog[]) {
    let log: TradeLog = {
      timeStamp: ticker.timeStamp,
      open: ticker.open,
      close: ticker.close,
      pSide: trade.side,
      pPrice: trade.positionPrice,
      pMargin: trade.positionMargin,
      pLevel: trade.level,
      pliq: trade.liqPrice,
      pEntry: trade.entryPrice,
      pol1Limit: trade.orderOnLoss1.limit,
      pol1Margin: trade.orderOnLoss1.margin,
      pol1Stat: trade.orderOnLoss1.stat,
      pol1Type: trade.orderOnLoss1.type,
      pol1From: trade.orderOnLoss1.fromPosition,
      gopLimit: trade.orderGetProfit.limit,
      gopMargin: trade.orderGetProfit.margin,
      gopStat: trade.orderGetProfit.stat,
      gopType: trade.orderGetProfit.type,
      gopFrom: trade.orderGetProfit.fromPosition,
      colLimit: trade.orderCloseLoss.limit,
      colMargin: trade.orderCloseLoss.margin,
      colStat: trade.orderCloseLoss.stat,
      colType: trade.orderCloseLoss.type,
      colFrom: trade.orderCloseLoss.fromPosition,
    };

    logs.push(log);
  }
}
export class BotLog {
  private profitLevels: number[] = botPositionPercent;
  private closeLevels: number[] = botPositionPercent;
  private addLevels: number[] = botPositionPercent;
  private maxLevrage: number[] = [
    3, 5, 8, 9, 10, 11, 12, 15, 18, 20, 25, 30, 35, 40, 45,
  ];
  private maxMargin: number[] = [
    0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1,
  ];

  private initOrder: Orders = {
    side: "init",
    limit: 0,
    margin: 0,
    stat: "open",
    type: "open Position",
    fromPosition: 0,
  };

  constructor(private data: Ticker[]) {}

  start() {
    let tradeLogs: TradeTest[] = [];
    // loop profitLevels
    for (let index = 0; index < this.profitLevels.length; index++) {
      // 8
      const get = this.profitLevels[index];
      console.log(`progress : ${((index / 8) * 100).toFixed(2)} %`);
      //loop closeLevels
      for (let cls = 0; cls < 5; cls++) {
        //4
        const cl = this.closeLevels[cls];
        //loop addLevels
        for (let adds = 0; adds < 5; adds++) {
          //8
          const add = this.addLevels[adds];

          //loop trough levrages
          for (let levs = 0; levs < this.maxLevrage.length; levs++) {
            // 15
            const lev = this.maxLevrage[levs];

            for (let mars = 0; mars < this.maxMargin.length; mars++) {
              // 10
              const mar = this.maxMargin[mars];

              let { report, longpnl, shortpnl , longMargin , shortMargin, maxSMargin,maxLMargin } = new TradingBot(
                mar,
                lev,
                add,
                get,
                cl
              ).tradingShip(this.data);

              tradeLogs.push({
                profitLevel: get,
                closeLevel: cl,
                addLossLevel: add,
                levrage: lev,
                maxLongMargin:maxLMargin,
                longPnl: longpnl,
                longMargin:longMargin,
                maxShortMargin:maxSMargin,
                shortPnl: shortpnl,
                shortMargin:shortMargin,
                totalProfit: report[2],
                totalLoss: report[3],
                totalpnl: report[0] + longpnl + shortpnl,
              });
            }
          }
        }
      }
    }
    return tradeLogs;
  }
  test() {
    let data = new TradingBot(0.01, 30, 0.3, 0.9, 0.95).tradingShip(this.data);
    return data;
  }
}
