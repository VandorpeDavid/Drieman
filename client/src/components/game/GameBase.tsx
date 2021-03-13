import React from 'react';
import { GameState, Player } from 'shared/dist/models';
import { LeaveRequest, PauseRequest, RequestMessage, ResumeRequest } from "shared/dist/messages/requests";
import HomeScreen from './HomeScreen';
import Game from './Game';
import { ResponseMessage } from 'shared/dist/messages/responses';
import autobind from 'react-autobind';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlayerStatus } from 'shared/dist/models/Player';


interface IGameBaseProps extends WithTranslation {
  game?: GameState,
  player?: Player,
  sendMessage: (message: RequestMessage) => Promise<ResponseMessage>,
  gameId?: string
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
    const { game, player, sendMessage, gameId, t } = this.props;

    if (!player) {
      return <HomeScreen sendMessage={sendMessage} />
    }

    let pauseButton = <p onClick={this.pauseGame}>{t('game.actions.pause')}</p>;
    if (player.status === PlayerStatus.PAUSED) {
       pauseButton = <p onClick={this.resumeGame}>{t('game.actions.resume')}</p>;
    }
    return <React.Fragment>
      <p>{gameId}</p>
      <p onClick={this.leaveGame}>{t('game.actions.leave')}</p>
      {pauseButton}

      <Game game={game as GameState} player={player as Player} sendMessage={sendMessage} />
    </React.Fragment>;
  }
}

export default withTranslation()(GameBase);
