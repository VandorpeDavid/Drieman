import { GameState, Player } from 'shared/dist/models';
import Room from "./Room";

export default class Game {
    playerMap: { [name: string]: Player } = {};
    state: GameState;
    room: Room;
    id: string;

    constructor(id : string) {
        this.id = id;
        this.playerMap = {};
        this.room = new Room("drieman::"+id);
        this.state = new GameState();
    }

    getCurrentPlayer() : Player {
        return this.state.players[this.state.activePlayer]
    }

    getPreviousDrinker() {
        const players = this.state.players;
        const currentIndex = this.state.activePlayer;
        const numPlayers = players.length;
        for(let i = players.length - 1; i > 0; --i) {
            const index = (currentIndex + i) % numPlayers;
            const player = players[index];
            if(player.canDrink()) {
                return player;
            }
        }

        return null;
    }

    getNextDrinker() {
        const players = this.state.players;
        const currentIndex = this.state.activePlayer;
        const numPlayers = players.length;
        for(let i = 1; i < players.length; ++i) {
            const index = (currentIndex + i) % numPlayers;
            const player = players[index];
            if(player.canDrink()) {
                return player;
            }
        }

        return null;
    }

    advanceTurn() {
        const players = this.state.players;
        const currentIndex = this.state.activePlayer;
        const numPlayers = players.length;
        for(let i = 1; i < players.length; ++i) {
            const index = (currentIndex + i) % numPlayers;
            const player = players[index];
            if(player.canRoll()) {
                this.state.activePlayer = index;
                return true;
            }
        }

        return false;
    }

    getPlayerById(id: string) : Player {
        return this.state.players.find((p) => p.id === id);
    }
}