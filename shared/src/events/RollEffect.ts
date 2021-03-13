import Player from "../models/Player";

export default class RollEffect {
    player: Player;
    amount: number;

    constructor(player: Player, amount: number) {
        this.player = player;
        this.amount = amount;
    }
}
