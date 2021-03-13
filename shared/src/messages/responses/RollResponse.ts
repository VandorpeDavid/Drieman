import ResponseMessage from "./ResponseMessage";
import RequestMessage from "../requests/RequestMessage";

export default class JoinResponse extends ResponseMessage {
    dice1: number;
    dice2: number;

    constructor(originalMessage: RequestMessage, dice1: number, dice2: number) {
        super("drieman_response_roll", originalMessage);
        this.dice1 = dice1;
        this.dice2 = dice2;
    }
}
