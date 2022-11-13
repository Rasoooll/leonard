import * as ccxt from "ccxt";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

function bybitInit (){
    let bybit = new ccxt.bybit ({
        'enableRateLimit': true,
        'apiKey': process.env.user,
        'secret': process.env.secr,
        'recv_window': 10000
        });

    return bybit;
}

export const bybit:ccxt.bybit = bybitInit();