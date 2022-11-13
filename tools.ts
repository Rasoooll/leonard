import { Positions } from "./profile";
import { LongLevels, longLevels } from "./config";

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
export interface OrderLevels{
    l1 : number ,
    l2 : number ,
    l3 : number ,
    l4 : number ,
    exit : number
}

export var longOrders : OrderLevels = {
    l1 :0 , l2: 0 , l3: 0 , l4: 0 , exit: 0
}

export var shortOrders : OrderLevels = {
    l1 :0 , l2: 0 , l3: 0 , l4: 0 , exit: 0
}

export function say(a:string[]){
    console.log("----------------------- ");
    
    for (let index = 0; index < a.length; index++) {
        console.log(a[index]);
        console.log(`' ' ' ' ' ' ' `);
    }
}

export function weighedPosisionsMid(positions:Positions[]){
    switch (positions.length) {
        case 0:
            return 0
        case 1:
            return 0
        case 2:
            let weightLong = positions[0].size * positions[0].price 
            let weightShort = positions[1].size * positions[1].price
            let sumSizes = positions[0].size + positions[1].size
            let weightedPosionsPrice = (weightLong+weightShort)/sumSizes
            return [weightedPosionsPrice.toFixed(2),] ;
    }
}

export function LastPriceFromWPP (){

}

export function safezone(positions:Positions[]){
    if ( positions.length>0 ) {
        for (let i = 0; i < positions.length; i++) {
            const element = positions[i];
            if (element.side == "long"){
                longOrders.l1 = element.price * longLevels.l1
                longOrders.l2 = element.price * longLevels.l2
                longOrders.l3 = element.price * longLevels.l3
                longOrders.l4 = element.price * longLevels.l4
                longOrders.exit = element.price * longLevels.last
            }else{
                
            }
        }
    }

}

