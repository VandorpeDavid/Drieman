import RequestMessage from "./RequestMessage";

export default class LeaveRequest extends RequestMessage {
    constructor() {
        super("drieman_leave");
    }
}