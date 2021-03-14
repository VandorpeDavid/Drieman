import RequestMessage from "./RequestMessage";

export default class HandoutRequest extends RequestMessage {
    amount: number;

    constructor(amount: number) {
        super("drieman_drink");
        this.amount = amount;
    }
}
