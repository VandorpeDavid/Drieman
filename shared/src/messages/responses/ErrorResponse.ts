import ResponseMessage from "./ResponseMessage";
import RequestMessage from "../requests/RequestMessage";

export default class ErrorResponse extends ResponseMessage {
    message: string;

    constructor(originalMessage: RequestMessage, message: string) {
        super("drieman_response_error", originalMessage);
        this.message = message;
    }
}
