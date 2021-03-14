import { handlers } from './handlers';
import {
    Session
} from "./models";
import { RequestMessage } from "shared/dist/messages/requests";
import { app, io, server } from "./servers";
import cors from "cors";
import { ErrorResponse } from "shared/dist/messages/responses";
const port = 8080; // default port to listen
import logger from "./logger";

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
        let response;

        try {
            logger.info(message);

            const handler = handlers[message.type];

            if (handler) {
                response = handler(session, message);
            } else {
                response = new ErrorResponse(message, "unknown request type");
            }
        } catch (err) {
            logger.error(err);
            response = new ErrorResponse(message, "internal server error");
        }
        session.socket.emit("response",
            response
        );
    });

    socket.on('disconnect', () => {
        logger.info("a user disconnected");
        try {
            handlers.drieman_disconnect(session, { id: "none" } as RequestMessage);
        } catch (err) {
            logger.error(err);
        }
    });

});

// start the Express + socketio server
server.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});
