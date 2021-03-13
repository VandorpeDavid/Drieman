import DriemanEvent from "./DriemanEvent";
import Player from "../models/Player";

export default class PlayerRename extends DriemanEvent {
    oldName: string;

    constructor(player: Player, oldName : string) {
        super(player, "player_rename");
        this.oldName = oldName;
    }
}