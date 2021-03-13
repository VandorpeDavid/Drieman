import DriemanEvent from "../events/DriemanEvent";
import { GameState } from "../models";

export default class EventMessage {
    event: DriemanEvent;
    state: GameState;

    constructor(event: DriemanEvent, state: GameState) {
        this.event = event;
        this.state = state;
    }
}