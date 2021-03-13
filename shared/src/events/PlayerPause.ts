import DriemanEvent from "./DriemanEvent";
import Player from "../models/Player";

export default class PlayerPause extends DriemanEvent {
    passTurn: boolean = false;

    constructor(player: Player, passTurn: boolean = false) {
        super(player, "player_pause");
        this.passTurn = passTurn;
    }
}
