import React from 'react';
import { Player } from 'shared/dist/models';
import { HandoutRequest, RequestMessage } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { ResponseMessage } from 'shared/dist/messages/responses';
import { FaBeer } from "react-icons/fa";

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
            return <span className="handout handout-disabled"><FaBeer size="3em" /></span>;
        }

        return <span className="handout" onClick={this.doHandout}><FaBeer size="3em" /></span>;
    }
}

export default PlayerHandoutButton;
