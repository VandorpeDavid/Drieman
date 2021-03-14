import {v4 as uuidv4} from 'uuid';

export enum PlayerStatus {
    PLAYING, PAUSED, LEFT
}

export default class Player {
    name: string;
    id: string;
    status: PlayerStatus = PlayerStatus.PLAYING;
    handouts: number = 0;
    lastSeen: Date;
    drunk: number;
    toDrink: number;

    constructor(name: string) {
        this.name = name;
        this.lastSeen = new Date();
        this.id = uuidv4();
        this.drunk = 0;
        this.toDrink = 0;
    }

    canDrink() {
        return this.status === PlayerStatus.PLAYING || this.status === PlayerStatus.PAUSED;
    }

    canRoll() {
        return this.status === PlayerStatus.PLAYING;
    }

    leave() {
        this.status = PlayerStatus.LEFT;
    }

    resume() {
        this.status = PlayerStatus.PLAYING;
    }

    pause() {
        this.status = PlayerStatus.PAUSED;
    }
}