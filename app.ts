import * as ccxt from "ccxt";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


// class bybitApi {
//     private cc ;
//     constructor() {
//         this.cc = ccxt.exchanges;
//         console.log(`cc : `, this.cc);
//     }
// }
// bybitApi;
// class accountRKeshtkar {
//     public bybit:any;
//     constructor(exchange = ccxt.bybit) {
//         this.bybit = new ccxt.bybit ({
//             'enableRateLimit': true,
//             'apiKey': process.env.user,
//             'secret': process.env.secr,
//             'recv_window': 5000
//             });
//             console.log(`bybit :`, this.bybit.fetchBalance());

//     }
// }
let balances :ccxt.bybit
const connect =async () => {
    let bybit:ccxt.bybit =await bybitInit()
    let openOrders = await bybit.fetchOpenOrders('ETHUSDT');
    let balance = await bybit.fetchBalance();
    console.log(" ");
    console.log(" ");
    
    console.log("***** Balances");
    console.log(`Usd balance`, balance.USDT);
    balancePercent(balance);
    
    console.log("***** Active Orders");
    ordersLog(openOrders)
    getEthPrice(bybit)
    console.log("**** Posisions");
    getPosistions(bybit)
} ;
connect();




// async function main() {
//     // let cc = ccxt.exchanges['bybit'];
//     // console.log(`cc : `, cc);
//     // bybit.then(async (x:ccxt.bybit)=>{
//         const bybit = await bybit;
//         // console.log(`x`, x.bybit.fetchBalance());
//         // let bybit = x;
        
        
// }
function balancePercent (balances:any){
    const free = balances.USDT.free;
    const used = balances.USDT.used;
    const total = balances.USDT.total;

    let usedToTotal = free/total*100;
    let freeToTotal = free/total*100;
    let usedToFree = used/free*100;
    // console.log(`Used To Total : `, usedToTotal.toFixed( 2 ) + " % ");
    // console.log(`Free To Total : `, freeToTotal.toFixed( 2 ) + " % ");
    // console.log(`Used To Free : `, usedToFree.toFixed( 2 ) + " % ");
    
    say([
        `Used To Total : `+ usedToTotal.toFixed( 2 ) + " % ",
        `Free To Total : `+ freeToTotal.toFixed( 2 ) + " % ",
        `Used To Free : `+ usedToFree.toFixed( 2 ) + " % "
    ])

}
function ordersLog(orders:any[]){
    for (let index = 0; index < orders.length; index++) {
        let order = orders[index]
        
        console.log(
            "price : "+order.price + 
            " / amount: " + order.amount+
            " / side: "+ order.side
            );
        
        
    }
    // console.log(orders[0].price);
    
}
async function getEthPrice(bybit:ccxt.bybit){
    // await bybit.loadMarkets();
    // console.log(bybit.market('ETHUSDT'));
    let ethInfo = await bybit.fetchTicker('ETHUSDT')
    say(['last ETH Price: '+ ethInfo.last])
    return ethInfo.last;
    

    // console.log(markets);
    // for (let index = 0; index < markets.length; index++) {
    //     if (markets[index].id == "ETHUSDT"){
    //         console.log(markets[index]);
            
    //     } 
        
    // }
    
}

async function getPosistions(bybit:ccxt.bybit){
    let ethOrders = 'ETHUSDT'
    let posisions =await bybit.fetchPositions([ethOrders]);
    for (let index = 0; index < posisions.length; index++) {
        const element = posisions[index];
        
        say([
            " # "+ index +
            ' -> ' + element.side + 
            ' / price: '+ element.entryPrice.toFixed( 2 ) + 
            ' / size: ' + element.contracts +
            ' / pnl: ' + element.unrealizedPnl.toFixed( 2 )+ " $ " + 
            ' '+ element.percentage.toFixed( 2 ) + " % "
        ])
        
    }
    // console.log(posisions);
    
}
function say(a:string[]){
    console.log("----------------------- ");
    
    for (let index = 0; index < a.length; index++) {
        console.log(a[index]);
        console.log(`' ' ' ' ' ' ' `);
    }
}
async function bybitInit (){
let bybit = new ccxt.bybit ({
    'enableRateLimit': true,
    'apiKey': process.env.user,
    'secret': process.env.secr,
    'recv_window': 10000
    });

    return await bybit;


// let bybit = new accountRKeshtkar()
// return bybit;
}

// await main();