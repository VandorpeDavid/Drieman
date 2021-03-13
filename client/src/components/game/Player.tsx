import React from 'react';
import { GameState, Player as PlayerModel } from 'shared/dist/models';
import { RequestMessage } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { PlayerStatus } from 'shared/dist/models/Player';
import { ResponseMessage } from 'shared/dist/messages/responses';
import PlayerHandoutButtons from './PlayerHandoutButtons';
import PlayerName from './PlayerName';
import { FaHatWizard } from "react-icons/fa";

interface IPlayerProps {
    game: GameState,
    me: PlayerModel,
    sendMessage: (message: RequestMessage) => Promise<ResponseMessage>
    playerIndex: number
}


class Player extends React.Component<IPlayerProps> {
    constructor(props: IPlayerProps) {
        super(props);
        autobind(this);
    }

    render() {
        const { game, playerIndex, me, sendMessage } = this.props;
        const player = game?.players[playerIndex];
        if (player?.status === PlayerStatus.LEFT) {
            return null;
        }

        let className = "card player"

        if (game?.activePlayer === playerIndex) {
            className += " player-current";
        }

        if(player?.status === PlayerStatus.PAUSED) {
            className += " player-paused";
        }

        if (player?.id === me.id) {
            className += " player-me";
        }

        let crown = null;
        if (player?.id === game.drieman?.id) {
            className += " player-drieman";

            crown = <FaHatWizard />
        }



        return <div className={className}>
            <div className="card-header">
                <div className="card-header-title">
                    {crown}
                    <PlayerName me={me} player={player} sendMessage={sendMessage} />
                </div>
            </div>
            <div className="card-content">
                <PlayerHandoutButtons me={me} player={player} sendMessage={sendMessage} />
            </div>
        </div>;
    }
}

export default Player;
