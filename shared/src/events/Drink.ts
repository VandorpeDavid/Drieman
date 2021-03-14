import DriemanEvent from "./DriemanEvent";
import Player from "../models/Player";

export default class Handout extends DriemanEvent {
    amount: number;

    constructor(drinker: Player, amount: number) {
        super(drinker, "drink");
        this.amount = amount;
    }
}