import RequestMessage from "../requests/RequestMessage";

export default class ResponseMessage {
    type: string;
    originalMessageId: string;

    constructor(type: string, originalMessage: RequestMessage) {
        this.originalMessageId = originalMessage.id;
        this.type = type;
    }
}