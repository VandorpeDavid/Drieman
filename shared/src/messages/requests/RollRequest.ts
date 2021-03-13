import RequestMessage from "./RequestMessage";

export default class RollRequest extends RequestMessage {
    constructor() {
        super("drieman_roll");
    }
}