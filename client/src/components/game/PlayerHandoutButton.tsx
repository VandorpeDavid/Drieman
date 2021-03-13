import React from 'react';
import { Player } from 'shared/dist/models';
import { HandoutRequest, RequestMessage } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { ResponseMessage } from 'shared/dist/messages/responses';


interface IPlayerHandoutButtonsProps {
    me: Player,
    sendMessage: (message: RequestMessage) => Promise<ResponseMessage>
    handout: number,
    player: Player
}


class PlayerHandoutButton extends React.Component<IPlayerHandoutButtonsProps> {
    constructor(props: IPlayerHandoutButtonsProps) {
        super(props);
        autobind(this);
    }

    doHandout() {
        const { handout, player, sendMessage } = this.props;
        sendMessage(
            new HandoutRequest(player, handout)
        );
    }

    render() {
        const { me, handout } = this.props;
        if (me.handouts < handout) {
            return <div>
                <div className="handout handout-disabled">+{handout}</div>
            </div>;
        }


        return <div>
            <div className="handout" onClick={this.doHandout}>+{handout}</div>
        </div>;
    }
}

export default PlayerHandoutButton;
