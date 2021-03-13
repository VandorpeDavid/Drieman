import RequestMessage from "./RequestMessage";
import Player from "../../models/Player";

export default class HandoutRequest extends RequestMessage {
    target: Player;
    amount: number;

    constructor(target: Player, amount: number) {
        super("drieman_handout");
        this.target = target;
        this.amount = amount;
    }
}
