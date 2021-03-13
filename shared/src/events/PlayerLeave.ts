import DriemanEvent from "./DriemanEvent";
import Player from "../models/Player";

export default class PlayerLeave extends DriemanEvent {
    passTurn: boolean = false;

    constructor(player: Player, passTurn: boolean = false) {
        super(player, "player_leave");
        this.passTurn = passTurn;
    }
}
