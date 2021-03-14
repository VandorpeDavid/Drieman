import React from 'react';
import { Player } from 'shared/dist/models';
import { RequestMessage } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { ResponseMessage } from 'shared/dist/messages/responses';
import PlayerHandoutButton from './PlayerHandoutButton';
import PlayerDrinkButton from './PlayerDrinkButton';

interface IPlayerHandoutButtonsProps {
    me: Player,
    sendMessage: (message: RequestMessage) => Promise<ResponseMessage>
    player: Player
}

class PlayerHandoutButtons extends React.Component<IPlayerHandoutButtonsProps> {
    constructor(props: IPlayerHandoutButtonsProps) {
        super(props);
        autobind(this);
    }

    render() {
        const { player, me, sendMessage } = this.props;
        if (player.id === me.id) {
            return <div>
            {
                [1, 2, 3, 4, 5, 6].map(
                    (amount) => <PlayerDrinkButton me={me} sendMessage={sendMessage} amount={amount} key={amount} />
                )
            }
        </div>;
        }

        return <div>
            {
                [1, 2, 3, 4, 5, 6].map(
                    (handout) => <PlayerHandoutButton player={player} me={me} sendMessage={sendMessage} handout={handout} key={handout} />
                )
            }
        </div>;
    }
}

export default PlayerHandoutButtons;
