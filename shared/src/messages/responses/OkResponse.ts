import ResponseMessage from "./ResponseMessage";
import RequestMessage from "../requests/RequestMessage";

export default class OkResponse extends ResponseMessage {
    constructor(originalMessage: RequestMessage) {
        super("drieman_response_ok", originalMessage)
    }
}
