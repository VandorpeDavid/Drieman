import {
    Game,
    Player,
    Session
} from "./models/";
import {
    PlayerJoin,
    PlayerLeave,
    PlayerResume,
    PlayerRename,
    Roll,
    Handout,
    DriemanEvent,
    PlayerPause,
    Drink
} from "shared/dist/events/";
import RollEffect from "shared/dist/events/RollEffect";
import {
    HandoutRequest,
    JoinRequest,
    LeaveRequest,
    RejoinRequest,
    RollRequest,
    ResumeRequest,
    PauseRequest,
    RenameRequest,
    NewGameRequest,
    ErrorRequest,
    DrinkRequest,
    RequestMessage
} from "shared/dist/messages/requests/";
import EventMessage from "shared/dist/messages/EventMessage";
import {
    OkResponse,
    JoinResponse,
    ErrorResponse,
    ResponseMessage,
    RollResponse
} from "shared/dist/messages/responses";

function isMissing(v: any) {
    return v === null || v === undefined;
}

import { v4 as uuidv4 } from 'uuid';

const games: { [name: string]: Game } = {};

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function broadcast(game: Game, event: DriemanEvent) {
    game.room.broadcast(new EventMessage(event, game.state));
}

function sanitizeName(newName: string): string {
    if (isMissing(newName)) {
        return undefined;
    }

    newName = newName.trim();

    if (newName.length === 0 || newName.length > 15) {
        return undefined;
    }

    return newName;
}

function makeGameId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let result = '';
    while (result === '' || result in games) {
        result = '';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    }
    return result;
}

function handleNewGame(session: Session, message: NewGameRequest) {
    const name = sanitizeName(message.name);

    if (isMissing(name)) {
        return new ErrorResponse(message, "invalid username");
    }

    const player = new Player(name);
    const event = new PlayerJoin(player);
    const secret = uuidv4();

    const gameId = makeGameId();

    const game = new Game(gameId);
    games[gameId] = game;

    game.playerMap[secret] = player;
    game.state.players.push(player);

    game.room.addListener(session);
    session.game = game;
    session.player = player;
    broadcast(game, event);

    return new JoinResponse(message, player, secret, gameId, game.state);
}

function handleLeave(session: Session, message: LeaveRequest) {
    const game = session.game;
    const player = session.player;
    if (isMissing(player)) {
        return new ErrorResponse(message, "unauthenticated")
    }

    player.leave();

    let passTurn = false;
    if (game.getCurrentPlayer().id === player.id) {
        game.advanceTurn();
        passTurn = true;
    }

    if (game.state.drieman?.id === player.id) {
        game.state.drieman = null;
    }

    broadcast(game, new PlayerLeave(player, passTurn));

    game.room.removeListener(session);
    session.game = null;
    session.player = null;

    if (game.state.players.filter((p) => p.canDrink()).length === 0) {
        games[game.id] = null; // Cleanup
    }

    return new OkResponse(message);
}

function handleJoin(session: Session, message: JoinRequest) {
    const name = sanitizeName(message.name);

    if (isMissing(name)) {
        return new ErrorResponse(message, "invalid username");
    }

    const player = new Player(name);
    const event = new PlayerJoin(player);
    const secret = uuidv4();

    if (!(message.gameId in games)) {
        return new ErrorResponse(message, "game not found")
    }
    player.connections++;

    const game = games[message.gameId];
    game.playerMap[secret] = player;
    game.state.players.push(player);

    game.room.addListener(session);
    session.game = game;
    session.player = player;
    broadcast(game, event);

    return new JoinResponse(message, player, secret, message.gameId, game.state);
}

function handleRejoin(session: Session, message: RejoinRequest) {
    const game = games[message.gameId];
    if (isMissing(game)) {
        return new ErrorResponse(message, "game not found")
    }

    const player = game.playerMap[message.secret];
    if (isMissing(player)) {
        return new ErrorResponse(message, "secret invalid");
    }

    player.resume()
    player.connections++;
    const event = new PlayerJoin(player, true)

    game.room.addListener(session);
    session.game = game;
    session.player = player;
    broadcast(game, event);

    return new JoinResponse(message, player, message.secret, message.gameId, game.state);
}

function handleResume(session: Session, message: ResumeRequest) {
    const game = session.game;
    const player = session.player;
    if (isMissing(player) || isMissing(game)) {
        return new ErrorResponse(message, "session not initialized");
    }

    player.resume()
    const event = new PlayerResume(player);

    broadcast(game, event);
    return new OkResponse(message);
}

function handleRename(session: Session, message: RenameRequest) {
    const game = session.game;
    const player = session.player;

    if (isMissing(player) || isMissing(game)) {
        return new ErrorResponse(message, "session not initialized");
    }

    const newName = sanitizeName(message.newName);
    if (isMissing(newName)) {
        return new ErrorResponse(message, "invalid username");
    }



    const oldName = player.name;
    player.name = newName;
    const event = new PlayerRename(player, oldName);

    broadcast(game, event);
    return new OkResponse(message);
}

function handlePause(session: Session, message: PauseRequest) {
    const game = session.game;
    const player = session.player;
    if (isMissing(player) || isMissing(game)) {
        return new ErrorResponse(message, "session not initialized");
    }

    player.pause();

    let passTurn = false;
    if (game.getCurrentPlayer() === player) {
        game.advanceTurn();
        passTurn = true;
    }

    const event = new PlayerPause(player, passTurn);

    broadcast(game, event);
    return new OkResponse(message);
}

function handleHandout(session: Session, message: HandoutRequest) {
    const game = session.game;
    const sender = session.player;
    if (isMissing(sender) || isMissing(game)) {
        return new ErrorResponse(message, "session not initialized");
    }

    const target = game.getPlayerById(message.target.id);
    if (isMissing(target)) {
        return new ErrorResponse(message, "handout recipient not found");
    }

    let amount = message.amount || 0;
    if (sender.handouts <= 0) {
        return new ErrorResponse(message, "no handouts left");
    }

    if (sender.handouts < amount) {
        amount = sender.handouts;
    }

    if (amount <= 0) {
        return new ErrorResponse(message, "handout needs to be atleast 1");
    }

    if (!target.canDrink()) {
        return new ErrorResponse(message, "handout target player left");
    }

    sender.handouts -= amount;
    target.toDrink += amount;
    const handout = new Handout(sender, target, amount);

    broadcast(game, handout);
    return new OkResponse(message);
}

function handleErrorRequest(_session: Session, message: ErrorRequest) {
    return new ErrorResponse(message, "error as requested");
}

function handleDisconnect(session: Session, message: RequestMessage) {
    const player = session.player;
    player.connections--;

    if (player.connections <= 0) {
        return handleLeave(session, message);
    } else {
        return new OkResponse(message);
    }
}

function handleDrink(session: Session, message: DrinkRequest) {
    const game = session.game;
    const player = session.player;
    if (isMissing(player) || isMissing(game)) {
        return new ErrorResponse(message, "session not initialized");
    }

    if (player.toDrink <= 0) {
        return new ErrorResponse(message, "you don't have to drink anything");
    }

    let amount = message.amount;

    if (amount > player.toDrink) {
        amount = player.toDrink;
    }

    if (amount <= 0) {
        return new ErrorResponse(message, "drink amount needs to be atleast 1");
    }

    player.toDrink -= amount;
    player.drunk += amount;

    const event = new Drink(player, amount);

    broadcast(game, event);
    return new OkResponse(message);
}

function handleRoll(session: Session, message: RollRequest) {
    const game = session.game;
    const roller = session.player;
    if (isMissing(roller) || isMissing(game)) {
        return new ErrorResponse(message, "session not initialized");
    }

    if (game.state.players.filter((p: Player) => p.canDrink()).length < 4) {
        return new ErrorResponse(message, "not enough players");
    }

    const currentPlayer = game.getCurrentPlayer();
    if (currentPlayer !== roller) {
        return new ErrorResponse(message, "not your turn");
    }

    const dice1 = randomInt(1, 6);
    const dice2 = randomInt(1, 6);
    const effects: RollEffect[] = [];
    const drieman = game.state.drieman;
    let threes = 0;
    if (dice1 === 3) {
        if (drieman) {
            drieman.toDrink++;
        }
        ++threes;
    }

    if (dice2 === 3) {
        if (drieman) {
            drieman.toDrink++;
        }
        ++threes;
    }

    const roll = new Roll(roller, dice1, dice2, effects, true, false, game.state.level);

    threes *= game.state.level;

    if (dice1 === dice2) {
        currentPlayer.handouts += dice1;
        roll.endOfTurn = false;
    }

    const sum = dice1 + dice2;
    if (sum === 7) {
        roll.endOfTurn = false;

        currentPlayer.toDrink++;
        if (currentPlayer === drieman) {
            ++threes;
        } else {
            effects.push(
                new RollEffect(currentPlayer, 1)
            );
        }
    } else if (sum === 8) {
        const nextPlayer = game.getNextDrinker();
        nextPlayer.toDrink++;

        roll.endOfTurn = false;

        if (nextPlayer === drieman) {
            ++threes;
        } else {
            effects.push(
                new RollEffect(nextPlayer, 1)
            );
        }
    } else if (sum === 6) {
        const previousPlayer = game.getPreviousDrinker();
        previousPlayer.toDrink++;

        roll.endOfTurn = false;

        if (previousPlayer === drieman) {
            ++threes;
        } else {
            effects.push(
                new RollEffect(previousPlayer, 1)
            );
        }
    } else if (sum === 3) {
        if (drieman === currentPlayer) {
            if (game.state.level < game.state.maxLevel) {
                roll.newDrieman = true;

                game.state.level++;
                roll.driemanLevel = game.state.level;
            }
        } else {
            roll.newDrieman = true;
            roll.driemanLevel = 1;
            game.state.drieman = currentPlayer;
        }
    }

    if (threes > 0 && drieman != null) {
        effects.push(
            new RollEffect(drieman, threes)
        );
    }

    if (roll.endOfTurn) {
        game.advanceTurn();
    }

    broadcast(game, roll);
    return new RollResponse(message, dice1, dice2);
}

export const handlers: { [name: string]: (s: Session, msg: any) => ResponseMessage } = {
    "drieman_join": handleJoin,
    "drieman_roll": handleRoll,
    "drieman_drink": handleDrink,
    "drieman_handout": handleHandout,
    "drieman_rejoin": handleRejoin,
    "drieman_leave": handleLeave,
    "drieman_pause": handlePause,
    "drieman_resume": handleResume,
    "drieman_rename": handleRename,
    "drieman_newGame": handleNewGame,
    "drieman_disconnect": handleDisconnect,
    "debug_error_request": handleErrorRequest
}