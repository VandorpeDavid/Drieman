import DriemanEvent from "./DriemanEvent";
import Player from "../models/Player";

export default class PlayerJoin extends DriemanEvent {
    rejoin: boolean = false;

    constructor(player: Player, rejoin : boolean = false) {
        super(player, "player_join");
        this.rejoin = rejoin;
    }
}