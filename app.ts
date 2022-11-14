import { weighedPosisionsMid, safezone, say, totalPower } from "./tools";
import {
  getBalances,
  ordersLog,
  printPositions,
  getPosistions,
} from "./profile";
import { getEthPrice } from "./markets";

// const init = require("./init");

const main = async () => {
  console.log(" ");
  console.log(" ");
  say([" #####  new fetch ##### "]);

  getBalances();
  ordersLog();
  getEthPrice();
  printPositions();
  let posistions = await getPosistions();
  console.log("weighted price ==>  ", weighedPosisionsMid(posistions));
  safezone(await getPosistions());
  totalPower(await getBalances(), await getEthPrice());
};

main();
