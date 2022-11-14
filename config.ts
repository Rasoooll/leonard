
export interface PositionsLevels{
    l1 : number ,
    l2 : number ,
    l3 : number ,
    l4 : number ,
    last : number
}

export interface PriceLevels {
    upperLiquid:number,
    plusL4:number,
    plusL3:number,
    plusL2:number,
    plusL1:number,
    minusL1:number,
    minusL2:number,
    minusL3:number,
    minusL4:number,
    lowerLiquid:number,
    
}

export const longLevels:PositionsLevels = {
    l1: 0.95 ,
    l2: 0.85 ,
    l3: 0.75 ,
    l4: 0.45 ,
    last : 0.30
}
export const shortLevels:PositionsLevels = {
    l1: 1.05 ,
    l2: 1.0 ,
    l3: 0.75 ,
    l4: 0.45 ,
    last : 0.30
}
export const priceLevels:PriceLevels = {
    upperLiquid:0.95,
    plusL4:0.55,
    plusL3:0.25,
    plusL2:0.15,
    plusL1:0.05,
    minusL1:0.05,
    minusL2:0.15,
    minusL3:0.25,
    minusL4:0.55,
    lowerLiquid:0.95,
    
}
export const levrage = 10;