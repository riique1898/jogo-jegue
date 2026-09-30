export type Suit='♣'|'♦'|'♥'|'♠'
export type Card={id:string;value:string;suit:Suit}
export type Player={id:string;name:string;isHost:boolean;connected:boolean;penalty:number}
export type GameState={startedAt:string;round:number;turnPlayerId:string}
export type GameRecord={id:string;startedAt:string;endedAt:string;players:Player[];winnerId:string;penalizedId:string;rounds:number;status:string;reason:string;localResult:string}
export function createGame(players:Player[]):GameState{return{startedAt:new Date().toISOString(),round:0,turnPlayerId:players[0]?.id??''}}
export function drawInitialHand(_game:GameState,_playerId:string):Card[]{const suits:Suit[]=['♣','♦','♥','♠'];return['7','Q','A','K'].map((value,index)=>({id:`${Date.now()}-${index}`,value,suit:suits[index]}))}
export function hasFourOfAKind(hand:Card[]):boolean{return hand.length===4&&new Set(hand.map(card=>card.value)).size===1}
