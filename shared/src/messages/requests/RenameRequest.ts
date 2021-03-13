import RequestMessage from "./RequestMessage";

export default class RenameRequest extends RequestMessage {
    newName: string;

    constructor(newName : string) {
        super("drieman_rename");
        this.newName = newName;
    }
}