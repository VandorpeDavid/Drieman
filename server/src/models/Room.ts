import EventMessage from "shared/dist/messages/EventMessage";
import { Session } from '.';
import { io } from "../servers";

export default class Room {
    name: string;

    constructor(name : string) {
        this.name = name;
    }

    addListener(session : Session) {
        session.socket.join(this.name);
    }

    removeListener(session : Session) {
        session.socket.leave(this.name);
    }
    broadcast(event : EventMessage) {
        io.to(this.name).emit("driemanEvent", event);
    }
}
