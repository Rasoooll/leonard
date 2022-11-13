
import { weighedPosisionsMid } from "./tools";
import {getBalances , ordersLog, printPositions , getPosistions} from "./profile"
import { getEthPrice } from "./markets";

// const init = require("./init");





const main =async () => {

    console.log(" ");
    console.log(" ");
    
    getBalances();
    ordersLog()
    getEthPrice()
    printPositions()
    let posistions =await  getPosistions();
    console.log("weighted price ==>  " , weighedPosisionsMid(posistions));
    



} ;

main();