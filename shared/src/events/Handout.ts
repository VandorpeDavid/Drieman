import DriemanEvent from "./DriemanEvent";
import Player from "../models/Player";

export default class Handout extends DriemanEvent {
    amount: number;
    target: Player;

    constructor(sender: Player, target : Player, amount: number) {
        super(sender, "handout");
        this.target = target;
        this.amount = amount;
    }
}