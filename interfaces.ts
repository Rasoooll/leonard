import { levrage } from "./config";
import { Balance, OHLCV, Order } from "ccxt";

export interface BybitProPositionInfo {
  positionIdx: 0 | 1 | 2; // 0= oneway , 1=buy/long , 2=sell/short
  riskId: string;
  symbol: string;
  side: string;
  size: string;
  positionValue: string;
  entryPrice: string;
  tradeMode: number;
  autoAddMargin: number;
  leverage: string;
  positionBalance: string;
  liqPrice: string;
  bustPrice: string;
  stopLoss: string;
  trailingStop: string;
  unrealisedPnl: string;
  createdTime: string;
  updatedTime: string;
  tpSlMode: string;
  riskLimitValue: string;
  activePrice: string;
}

export interface ccxtBybitPositions {
  info: {
    user_id: string;
    symbol: string;
    side: string;
    size: string;
    position_value: string;
    entry_price: string;
    liq_price: string;
    bust_price: string;
    leverage: string;
    auto_add_margin: string;
    is_isolated: true;
    position_margin: string;
    occ_closing_fee: string;
    realised_pnl: string;
    cum_realised_pnl: string;
    free_qty: string;
    tp_sl_mode: string;
    unrealised_pnl: string;
    deleverage_indicator: string;
    risk_id: string;
    stop_loss: string;
    take_profit: string;
    trailing_stop: string;
    tp_trigger_by: string;
    sl_trigger_by: string;
    position_idx: string;
    mode: string;
  };
  id: number;
  symbol: string;
  timestamp: number;
  datetime: number;
  initialMargin: number;
  initialMarginPercentage: number;
  maintenanceMargin: undefined;
  maintenanceMarginPercentage: undefined;
  entryPrice: number;
  notional: number;
  leverage: number;
  unrealizedPnl: number;
  contracts: number;
  contractSize: number;
  marginRatio: undefined;
  liquidationPrice: number;
  markPrice: undefined;
  collateral: number;
  marginMode: string;
  side: string;
  percentage: number;
}

export interface ProfileData {
  id: number;
  side: string;
  size: number;
  entryPrice: number;
  leverage: number;
  liqPrice: number;
  unrealised_pnl: number;
  percentage?: number;
}

export interface fibPair {
  percent: number;
  size: number;
}

export interface BotPlan {
  id: number;
  size: number;
  level: 0 | 1 | 2 | 3 | 4;
  pnl$: number;
  pnl: number;
}

export interface ohlcvData {
  m1: Ticker[];
  m15: Ticker[];
  h1: Ticker[];
  h4: Ticker[];
  d1: Ticker[];
}
export type BBTrend = "down" | "up";
export type OrderTypes = "short" | "long";
export interface Ticker {
  timeStamp: string;
  open: number;
  high: number;
  close: number;
  low: number;
  vol: number;
  trend: -1 | 1;
  highLow: number;
  closeOpen: number;
  midBB?: number;
  upperBB?: number;
  lowerBB?: number;
  pbBB?: number;
  highUpper?: number;
  lowLower?: number;
  hull?: number;
  hullGreaterAvg10?: number | null;
  bbTrend?: BBTrend;
  activateOrder?: OrderTypes;
  PnL?: number;
}

export interface Trends {
  m1?: BBTrend;
  m1CloseOpen?: number;
  m15?: BBTrend;
  m15CloseOpen?: number;
  h1?: BBTrend;
  h1CloseOpen?: number;
  h4?: BBTrend;
  h4CloseOpen?: number;
  d1?: BBTrend;
  d1CloseOpen?: number;
}
export type Side = "short" | "long" | "init";
export interface botPostisions {
  side: Side;
  levrage: number;
  initialMargin: number;
  positionMargin: number;
  liqPrice: number;
  positionPrice: number;
  entryPrice: number;
}
export interface history {
  timeStamp: string;
  open: number;
  high: number;
  close: number;
  low: number;
  vol: number;
  trend: -1 | 1;
  highLow: number;
  closeOpen: number;
  bbTrend?: BBTrend;
  activateOrder?: OrderTypes;
  PnL?: number;
}
export type State = "open" | "canceled" | "filled"
export interface Orders {
  side: Side;
  limit: number;
  margin: number;
  stat:State
}
