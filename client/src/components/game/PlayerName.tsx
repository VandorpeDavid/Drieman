import React from 'react';
import { Player as PlayerModel } from 'shared/dist/models';
import { RenameRequest, RequestMessage } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { ResponseMessage } from 'shared/dist/messages/responses';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IPlayerNameProps extends WithTranslation {
    me: PlayerModel,
    player: PlayerModel,
    sendMessage: (message: RequestMessage) => Promise<ResponseMessage>
}

interface IPlayerNameState {
    editting: boolean,
    submitting: boolean,
    newName: string
}

class PlayerName extends React.Component<IPlayerNameProps, IPlayerNameState> {
    constructor(props: IPlayerNameProps) {
        super(props);
        this.state = {
            editting: false,
            submitting: false,
            newName: ''
        }

        autobind(this);
    }

    onChange(event: React.FormEvent<HTMLInputElement>) {
        this.setState({ newName: event.currentTarget.value });
    }

    beginEditting() {
        const { player, me } = this.props;
        if (player.id !== me.id) {
            return;
        }

        this.setState({
            editting: true,
            submitting: false,
            newName: player.name
        });
    }

    cancel() {
        this.setState({
            editting: false,
        });
    }

    submit() {
        this.setState(
            { submitting: true },
            this.doRename
        );
    }

    doRename() {
        this.props.sendMessage(new RenameRequest(this.state.newName))
            .then((_resp) => this.setState({ editting: false }))
            .catch((_error) => this.setState({ submitting: false }))
    }

    render() {
        const { t, player } = this.props;
        if (this.state.editting) {
            return <div>
                <input type="text" value={this.state.newName} onChange={this.onChange}/>
                <button onClick={this.submit}>{t('common.confirm')}</button>
                <button onClick={this.cancel}>{t('common.cancel')}</button>
            </div>;
        }

        return <div onClick={this.beginEditting}>
            {player.name}
        </div>
    }
}

export default withTranslation()(PlayerName);
