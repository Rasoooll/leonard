import { OHLCV } from 'ccxt';
import { Ticker } from './interfaces';
import { bollingerbands, fibonacciretracement } from "technicalindicators";
import { getData } from "./getData";

export function BB(data:number[]) {

  let bb = bollingerbands({        
    period: 20,
    stdDev: 2,
    values: data
  });
    return bb;
}

export function waveRetracement(){
    let wr = fibonacciretracement(1070.77 , 1348.27)
    console.log("fib retracement : " , wr);
    
    return wr
}