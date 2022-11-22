import * as ccxt from "ccxt";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { ContractClient} from "bybit-api";
// import {Axios} from "axios"

function bybitInit (){
    let bybit = new ccxt.bybit ({
        'enableRateLimit': true,
        'apiKey': process.env.user,
        'secret': process.env.secr,
        'recv_window': 10000
        });

    return bybit;
}

function bybitProInit(){
    let key = process.env.user
    let secret = process.env.secr
    let bybitPro = new ContractClient({
        key ,
        secret,
        strict_param_validation: true

    })
    return bybitPro
}

export const bybit:ccxt.bybit = bybitInit();

export const bybitPro:ContractClient = bybitProInit();