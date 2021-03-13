import React from 'react';
import { GameState, Player } from 'shared/dist/models';
import { RequestMessage } from "shared/dist/messages/requests";
import DicePair from './DicePair';
import PlayerView from "./Player";
import { ResponseMessage } from 'shared/dist/messages/responses';


interface IGameProps {
    game: GameState,
    player: Player,
    sendMessage: (message: RequestMessage) => Promise<ResponseMessage>
}

class AppContainer extends React.Component<IGameProps> {
    render() {
        const { game } = this.props;

        return <React.Fragment>
            <DicePair {...this.props} />
            {
                game?.players.map((player, index) => <PlayerView {...this.props} me={this.props.player} playerIndex={index} key={player.id} />)
            }
        </React.Fragment>
    }
}

export default AppContainer;
