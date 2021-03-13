import Player from "../models/Player";

export default class DriemanEvent {
    type: string;
    source: Player;

    constructor(player: Player, type: string) {
        this.source = player;
        this.type = type;
    }
}