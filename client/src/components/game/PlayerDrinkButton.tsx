import React from 'react';
import { Player } from 'shared/dist/models';
import { DrinkRequest, RequestMessage } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { ResponseMessage } from 'shared/dist/messages/responses';
import { FaGlassWhiskey } from "react-icons/fa";

interface IPlayerDrinkButtonsProps {
    me: Player,
    sendMessage: (message: RequestMessage) => Promise<ResponseMessage>
    amount: number
}


class PlayerDrinkButton extends React.Component<IPlayerDrinkButtonsProps> {
    constructor(props: IPlayerDrinkButtonsProps) {
        super(props);
        autobind(this);
    }

    doDrink() {
        const { amount, sendMessage } = this.props;
        sendMessage(
            new DrinkRequest(amount)
        );
    }

    render() {
        const { me, amount } = this.props;
        if (me.toDrink < amount) {
            return <span className="handout handout-disabled"><FaGlassWhiskey size="3em" /></span>;
        }

        return <span className="handout" onClick={this.doDrink}><FaGlassWhiskey size="3em" /></span>;
    }
}

export default PlayerDrinkButton;
