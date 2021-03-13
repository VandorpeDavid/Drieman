import React from 'react';
import io from "socket.io-client";
import config from "../config/config.json";
import EventMessage from "shared/dist/messages/EventMessage";
import { GameState, Player } from 'shared/dist/models';
import DriemanEvent from 'shared/dist/events/DriemanEvent';
import { RejoinRequest, RequestMessage } from "shared/dist/messages/requests";
import { JoinResponse, ResponseMessage } from "shared/dist/messages/responses";
import produce from "immer"
import Game from "./game/GameBase";
import { default as RequestsLog, RequestStatus, ISentRequest } from './requests/RequestLog';
import autobind from 'react-autobind';

interface IAppBaseProps {
}

interface IAppBaseState {
  game?: GameState,
  gameId?: string,
  playerId?: string,
  player?: Player,
  connected: boolean,
  socket?: SocketIOClient.Socket,
  events: DriemanEvent[],
  requests: ISentRequest[]
}

class AppBase extends React.Component<IAppBaseProps, IAppBaseState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      game: undefined,
      playerId: undefined,
      socket: undefined,
      connected: false,
      events: [],
      requests: []
    };

    autobind(this);
  }

  processGameUpdate(game: GameState) {
    this.setState((prevState) => ({
      game,
      player: game.players.find((player) => player.id === prevState.playerId)
    }));
  }
  componentDidMount() {
    if (this.state.socket) {
      return;
    }

    console.log("Initializing websocket connection...");
    const socket = io(config.serverUrl);
    this.setState({ socket });

    socket.on("connect", () => {
      const gameId = localStorage.getItem('gameId');
      const secret = localStorage.getItem('secret');
      if (gameId && secret) {
        this.sendMessage(new RejoinRequest(gameId, secret))
          .catch((_error) => {
            localStorage.removeItem('secret');
            localStorage.removeItem('gameId');
          })
          .finally(() => this.setState({ connected: true }));
      } else {
        this.setState({ connected: true });
      }
    });

    socket.on('driemanEvent', (eventMessage: EventMessage) => {
      console.log("event received", eventMessage);

      const game = eventMessage.state;
      const event = eventMessage.event;
      this.setState(
        (prevState) => ({
          events: prevState.events.concat([event])
        }));

      this.processGameUpdate(game)
    });


    socket.on('response', (response: ResponseMessage) => {
      console.log("response received", response);
      this.setState(produce((draft: IAppBaseState) => {
        let request = draft.requests.find((request) => request.message.id === response.originalMessageId) as ISentRequest;
        if (request) {
          request.response = response;

          if (response.type === 'drieman_response_error') {
            request.error(response);
            request.status = RequestStatus.ERROR;
          } else {
            request.resolve(response);
            request.status = RequestStatus.SUCCESS;

            // Remove successfull response after 3s
            setTimeout(
              () => this.removeRequestByMessageId(response.originalMessageId),
              3_000
            );
          }
        }
      }));
    });
  }

  async sendMessage(message: RequestMessage): Promise<ResponseMessage> {
    const _that = this;
    if (message.type === 'drieman_leave') {
      this.setState({
        playerId: undefined,
        game: undefined,
        gameId: undefined,
        player: undefined,
        events: []
      });

      localStorage.removeItem('secret');
      localStorage.removeItem('gameId');
    }

    const response = await new Promise<ResponseMessage>((resolve, error) => {
      _that.setState((previousState) => ({
        requests: previousState.requests.concat([
          {
            message,
            resolve,
            error,
            status: RequestStatus.PENDING
          }
        ])
      }),
        () => _that.state.socket?.emit('request', message)
      );
    });

    if (response.type === 'drieman_response_join') {
      this.handleJoinResponse(response as JoinResponse);
    }

    return response;
  }

  handleJoinResponse(response: JoinResponse) {
    // TODO: save secret and game id in LocalStorage.
    this.setState(
      {
        playerId: response.player.id,
        gameId: response.gameId
      },
      () => this.processGameUpdate(response.game));

    localStorage.setItem('secret', response.secret);
    localStorage.setItem('gameId', response.gameId);
  }

  removeRequestByMessageId(requestId: string) {
    this.setState(
      produce((draft: IAppBaseState) => {
        var requests = draft.requests;
        var index = requests.findIndex((request) => request.message.id === requestId);
        if (index > -1) {
          requests.splice(index, 1);
        }
      }))
  }

  removeRequest(request: ISentRequest) {
    this.removeRequestByMessageId(request.message.id);
  }

  render() {
    const { connected, player, game, events, requests, gameId } = this.state;
    if (!connected) {
      return <p>Loading</p>;
    }

    return <React.Fragment>
      <Game sendMessage={this.sendMessage} player={player} game={game} gameId={gameId} events={events} />
      <RequestsLog requests={requests} removeRequest={this.removeRequest} />
    </React.Fragment>;
  }
}

export default AppBase;
