import { Socket } from 'socket.io';
import Game from './Game';
import { Player } from 'shared/dist/models';

export default class Session {
    game: Game;
    socket: Socket;
    player: Player;

    constructor(socket: Socket) {
        this.socket = socket;
    }
}