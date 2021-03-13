import React from 'react';
import { RequestMessage, RollRequest } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { GameState, Player } from 'shared/dist/models';
import { ResponseMessage, RollResponse } from 'shared/dist/messages/responses';
import { withTranslation, WithTranslation } from 'react-i18next';


interface IDiceProps extends WithTranslation {
    game: GameState,
    player: Player,
    sendMessage: (message: RequestMessage) => Promise<ResponseMessage>
}

interface IDiceState {
    rolling: boolean;
    dice1: number;
    dice2: number;
}

class DicePair extends React.Component<IDiceProps, IDiceState> {
    constructor(props: IDiceProps) {
        super(props);
        this.state = { rolling: false, dice1: 1, dice2: 1};
        autobind(this);
    }

    roll() {
        this.setState(
            { rolling: true },
            () => {
                this.props.sendMessage(new RollRequest())
                .then((resp) => {
                    const response = resp as RollResponse;
                    this.setState({
                        rolling: false,
                        dice1: response.dice1,
                        dice2: response.dice2
                    })
                })
                    .catch((_error) => this.setState({ rolling: false }));
            }
        );
    }

    render() {
        const { game, player, t } = this.props;
        if (game?.players[game?.activePlayer].id !== player.id) {
            return <button className="roll-button-disabled">{t('game.actions.roll')}</button>;
        }

        if (this.state.rolling) {
            // TODO
            return <p>Rolling.</p>;
        }
        return <button onClick={this.roll}>{t('game.actions.roll')}</button>;
    }
}

export default withTranslation()(DicePair);
