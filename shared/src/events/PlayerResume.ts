import DriemanEvent from "./DriemanEvent";
import Player from "../models/Player";

export default class PlayerResume extends DriemanEvent {
    constructor(player : Player) {
        super(player, "player_resume");
    }
}
