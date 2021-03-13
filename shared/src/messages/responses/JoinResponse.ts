import ResponseMessage from "./ResponseMessage";
import RequestMessage from "../requests/RequestMessage";
import { Player, GameState } from "../../models/";

export default class JoinResponse extends ResponseMessage {
    player: Player;
    secret: string;
    gameId: string;
    game: GameState

    constructor(originalMessage: RequestMessage, player: Player, secret: string, gameId: string, game: GameState) {
        super("drieman_response_join", originalMessage);
        this.player = player;
        this.secret = secret;
        this.gameId = gameId;
        this.game = game;
    }
}
