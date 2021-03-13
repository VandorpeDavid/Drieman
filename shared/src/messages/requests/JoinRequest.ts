import RequestMessage from "./RequestMessage";

export default class JoinRequest extends RequestMessage {
    name: string;
    gameId: string;

    constructor(name: string, gameId: string) {
        super("drieman_join")
        this.name = name;
        this.gameId = gameId;
    }
}