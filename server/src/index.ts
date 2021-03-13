import winston from "winston";
import { handlers } from './handlers';
import {
    Session
} from "./models";
import { RequestMessage, LeaveRequest } from "shared/dist/messages/requests";
import { app, io, server } from "./servers";
import cors from "cors";
import { ErrorResponse } from "shared/dist/messages/responses";
const port = 8080; // default port to listen

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

app.use(cors());
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket: any) => {
    logger.info("a user connected");
    const session = new Session(socket);


    socket.on('request', (message: RequestMessage) => {
        logger.info(message);

        const handler = handlers[message.type];
        let response;

        if (handler) {
            try {
                response = handler(session, message);
            } catch (err) {
                logger.error(err);
                response = new ErrorResponse(message, "internal server error");
            }
        } else {
            response = new ErrorResponse(message, "unknown request type");
        }
        session.socket.emit("response",
            response
        );
    });

    socket.on('disconnect', () => {
        logger.info("a user disconnected");
        handlers.drieman_leave(session, { id: "none" } as LeaveRequest);
    });

});

// start the Express + socketio server
server.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});
