
export interface PositionsLevels{
    l1 : number ,
    l2 : number ,
    l3 : number ,
    l4 : number ,
    last : number
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