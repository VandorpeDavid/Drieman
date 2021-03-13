import RequestMessage from "./RequestMessage";

export default class NewGameRequest extends RequestMessage {
    name: string;

    constructor(name: string) {
        super("drieman_newGame");
        this.name = name;
    }
}