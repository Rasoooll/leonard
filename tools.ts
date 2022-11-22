import { ccxtBybitPositions, ProfileData } from "./interfaces";
import { positionLevrage, PriceLevels, priceLevels } from "./config";
import { createLogger, transports, format } from "winston";

// export interface LongLevels{
//     l1 : number = 0 ,
//     l2 : number = 0 ,
//     l3 : number = 0 ,
//     l4 : number = 0
// }

// export class LongLevels {
//     public l1:number = 0
//     public l2:number = 0
//     public l3:number = 0
//     public l4:number = 0
// }
export interface OrderLevels {
  l1: number;
  l2: number;
  l3: number;
  l4: number;
  liquidity: number;
}

export var longOrders: OrderLevels = {
  l1: 0,
  l2: 0,
  l3: 0,
  l4: 0,
  liquidity: 0,
};

export var shortOrders: OrderLevels = {
  l1: 0,
  l2: 0,
  l3: 0,
  l4: 0,
  liquidity: 0,
};

const infoLogger = createLogger({
  transports: [
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint()
      ),
    }),
  ],
});

export function say(a: any[]) {
  console.log("----------------------- ");

  // infoLogger.log("info" ,"----------------------- ");

  for (let index = 0; index < a.length; index++) {
    console.log(a[index]);
    console.log(`' ' ' ' ' ' ' `);
    infoLogger.log("info", a[index]);
  }
}

export function weighedPosisionsMid(positions: ccxtBybitPositions[]) {
  switch (positions.length) {
    case 0:
      return 0;
    case 1:
      return 0;
    case 2:
      let weightLong = positions[0].contracts * positions[0].entryPrice;
      let weightShort = positions[1].contracts * positions[1].entryPrice;
      let sumSizes = positions[0].contracts + positions[1].contracts;
      let weightedPosionsPrice = (weightLong + weightShort) / sumSizes;
      return [weightedPosionsPrice.toFixed(2)];
  }
}

export function LastPriceFromWPP() {}

export function safezone(positions: ccxtBybitPositions[]) {
  if (positions.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      const element = positions[i];
      // console.log("element ====================== ");
      // console.log(element);

      if (element.side == "long" && element.initialMargin != undefined) {
        longOrders.l1 = Number(
          (
            element.entryPrice +
            (1 - ((priceLevels.minusL1 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        longOrders.l2 = Number(
          (
            element.entryPrice +
            (1 - ((priceLevels.minusL2 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        longOrders.l3 = Number(
          (
            element.entryPrice +
            (1 - ((priceLevels.minusL3 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        longOrders.l4 = Number(
          (
            element.entryPrice +
            (1 - ((priceLevels.minusL4 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        longOrders.liquidity = Number(
          (
            element.entryPrice +
            (1 -
              ((priceLevels.lowerLiquid + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
      } else if (
        element.side == "short" &&
        element.initialMargin != undefined
      ) {
        shortOrders.l1 = Number(
          (
            element.entryPrice -
            (1 - ((priceLevels.minusL1 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        shortOrders.l2 = Number(
          (
            element.entryPrice -
            (1 - ((priceLevels.minusL2 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        shortOrders.l3 = Number(
          (
            element.entryPrice -
            (1 - ((priceLevels.minusL3 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        shortOrders.l4 = Number(
          (
            element.entryPrice -
            (1 - ((priceLevels.minusL4 + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
        shortOrders.liquidity = Number(
          (
            element.entryPrice -
            (1 -
              ((priceLevels.lowerLiquid + 0.01) * element.entryPrice) / positionLevrage)
          ).toFixed(2)
        );
      }
    }
    // say([longOrders, shortOrders]);
    return [longOrders, shortOrders];
  }
}

export function totalPower(totalUSDT: number, ethPrice: number) {
  let totalEth = Number(((totalUSDT / ethPrice) * positionLevrage).toFixed(2)) - 0.01;
  say([totalEth]);
  return totalEth;
}

export function getUnixXHoursAgo(hr: number) {
  let min = 60;
  let hour = 60;
  let time = Date.now() - (hour * min * hr) ;
  // console.log("time : ", time);

  return time;
}

export function getLevels() {}
