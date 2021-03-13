import RequestMessage from "./RequestMessage";

export default class RejoinRequest extends RequestMessage {
    gameId: string;
    secret: string;

    public constructor(gameId : string, secret : string) {
        super("drieman_rejoin");
        this.gameId = gameId;
        this.secret = secret;
    }

}