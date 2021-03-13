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
            <div className="tile is-ancestor">
                <div className="tile is-vertical">
                    <div className="tile">
                        <DicePair {...this.props} />
                    </div>
                    <div className="tile is-parent player-list">
                        {
                            game?.players.map((player, index) =>
                                <PlayerView {...this.props} me={this.props.player} playerIndex={index} key={player.id} />
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="level">
            </div>
            <div className="level">

            </div>
        </React.Fragment>
    }
}

export default AppContainer;
