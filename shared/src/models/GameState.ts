import Player from "./Player";

export default class GameState {
    drieman?: Player = undefined;
    level: number = 1;
    maxLevel: number = 1;
    players: Player[] = [];
    activePlayer: number = 0;
    lastEvent: Date;

    constructor() {
        this.lastEvent = new Date();
    }
}
