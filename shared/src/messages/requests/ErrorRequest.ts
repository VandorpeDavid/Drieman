import RequestMessage from "./RequestMessage";

export default class ErrorRequest extends RequestMessage {
    constructor() {
        super("debug_error_request");
    }
}