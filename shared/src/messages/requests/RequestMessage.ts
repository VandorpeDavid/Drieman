import { v4 as uuidv4 } from 'uuid';

export default class RequestMessage {
    id: string;
    type: string;

    constructor(type: string) {
        this.id = uuidv4();
        this.type = type;
    }
}