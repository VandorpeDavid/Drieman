import React from 'react';
import { GameState, Player } from 'shared/dist/models';
import { LeaveRequest, PauseRequest, RequestMessage, ResumeRequest } from "shared/dist/messages/requests";
import HomeScreen from './HomeScreen';
import Game from './Game';
import { ResponseMessage } from 'shared/dist/messages/responses';
import autobind from 'react-autobind';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlayerStatus } from 'shared/dist/models/Player';
import EventsLog from './events/EventLog';
import DriemanEvent from 'shared/dist/events/DriemanEvent';
import Navbar from "../navbar";

interface IGameBaseProps extends WithTranslation {
  game?: GameState,
  player?: Player,
  sendMessage: (message: RequestMessage) => Promise<ResponseMessage>,
  gameId?: string,
  events: DriemanEvent[]
}

class GameBase extends React.Component<IGameBaseProps> {

  constructor(props: IGameBaseProps) {
    super(props);
    autobind(this);
  }

  leaveGame() {
    this.props.sendMessage(new LeaveRequest())
      .catch(console.log);
  }

  pauseGame() {
    this.props.sendMessage(new PauseRequest())
      .catch(console.log);
  }

  resumeGame() {
    this.props.sendMessage(new ResumeRequest())
      .catch(console.log);
  }

  render() {
    const { game, player, sendMessage, gameId, events, t } = this.props;

    if (!player) {
      return <React.Fragment>
        <Navbar />
        <div className="main-content container">
          <HomeScreen sendMessage={sendMessage} />
        </div>
      </React.Fragment>
    }

    let pauseButton = <a className="button is-rounded" onClick={this.pauseGame}>{t('game.actions.pause')}</a>;
    if (player.status === PlayerStatus.PAUSED) {
      pauseButton = <a className="button is-rounded" onClick={this.resumeGame}>{t('game.actions.resume')}</a>;
    }
    return <React.Fragment>
      <Navbar>
        <div className="gamecode button">
        {t('common.code')}: {gameId}
        </div>

        {pauseButton}
        <button className="button is-rounded" onClick={this.leaveGame}>
          {t('game.actions.leave')}
        </button>
      </Navbar>
      <div className="main-content container">

        <div className="level">
          <EventsLog events={events} />
        </div>
        <div className="level">
          <Game game={game as GameState} player={player as Player} sendMessage={sendMessage} />
        </div>
      </div>

    </React.Fragment>;
  }
}

export default withTranslation()(GameBase);
