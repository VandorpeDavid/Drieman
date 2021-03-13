import RequestMessage from "./RequestMessage";

export default class PauseRequest extends RequestMessage {
    constructor() {
        super("drieman_pause");
    }
}