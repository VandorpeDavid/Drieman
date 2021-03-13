import React from 'react';
import { RequestMessage } from "shared/dist/messages/requests";
import { JoinRequest, NewGameRequest } from "shared/dist/messages/requests";
import autobind from 'react-autobind';
import { ResponseMessage } from 'shared/dist/messages/responses';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IHomeScreenState {
  username: string;
  code: string;
  submitting: boolean;
}

interface IHomeScreenProps extends WithTranslation {
  sendMessage: (message: RequestMessage) => Promise<ResponseMessage>,
}

class HomeScreen extends React.Component<IHomeScreenProps, IHomeScreenState> {
  constructor(props: IHomeScreenProps) {
    super(props);
    this.state = {
      username: '',
      code: '',
      submitting: false
    };

    autobind(this);
  }

  onUsernameChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ username: event.currentTarget.value });
  }

  onCodeChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ code: event.currentTarget.value });
  }

  joinGame() {
    this.setState({
      submitting: true
    });

    this.props.sendMessage(new JoinRequest(this.state.username, this.state.code))
      .catch((_err) => this.setState({ submitting: false }));
  }

  createGame() {
    this.setState({
      submitting: true
    });

    this.props.sendMessage(new NewGameRequest(this.state.username))
      .catch((_err) => this.setState({ submitting: false }));
  }
  render() {
    const t = this.props.t;
    return <React.Fragment>
      <div>
        {t('common.username')}:
      <input type="text" value={this.state.username} onChange={this.onUsernameChange} />
        {t('common.code')}:
      <input type="text" value={this.state.code} onChange={this.onCodeChange} />
        <button onClick={this.joinGame}>{t('game.actions.join')}</button>
      </div>
      <div>
        {t('common.username')}:
      <input type="text" value={this.state.username} onChange={this.onUsernameChange} />

        <button onClick={this.createGame}>{t('game.actions.create')}</button>
      </div>
    </React.Fragment>
  }
}

export default withTranslation()(HomeScreen);