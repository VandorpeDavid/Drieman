import RequestMessage from "./RequestMessage";

export default class ResumeRequest extends RequestMessage {
    constructor() {
        super("drieman_resume");
    }
}