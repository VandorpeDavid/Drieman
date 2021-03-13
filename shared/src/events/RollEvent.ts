import DriemanEvent from "./DriemanEvent";
import RollEffect from "./RollEffect";
import Player from "../models/Player";

export default class Roll extends DriemanEvent {
    dice1: number;
    dice2: number;
    effects: RollEffect[] = [];
    endOfTurn: boolean;
    newDrieman: boolean;
    driemanLevel: number;

    constructor(player : Player, dice1: number, dice2: number, effects: RollEffect[], endOfTurn: boolean, newDrieman: boolean, driemanLevel: number) {
        super(player, "roll");
        this.dice1 = dice1;
        this.dice2 = dice2;
        this.effects = effects;
        this.endOfTurn = endOfTurn;
        this.newDrieman = newDrieman;
        this.driemanLevel = driemanLevel;
    }
}
