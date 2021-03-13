import React from 'react';
import { RequestMessage } from "shared/dist/messages/requests";
import { ResponseMessage, ErrorResponse } from "shared/dist/messages/responses";
import autobind from 'react-autobind';
import { withTranslation, WithTranslation } from 'react-i18next';

export enum RequestStatus {
    PENDING, SUCCESS, ERROR
}

export interface ISentRequest {
    resolve: (value: ResponseMessage) => void;
    error: (value: ResponseMessage) => void;
    message: RequestMessage;
    response?: ResponseMessage,
    status: RequestStatus
}

interface IEventLogEntryProps extends WithTranslation {
    request: ISentRequest,
    removeRequest: (request: ISentRequest) => void
}

const alertMap = {
    [RequestStatus.SUCCESS]: 'is-success',
    [RequestStatus.PENDING]: 'is-info',
    [RequestStatus.ERROR]: 'is-danger',
}
class EventLogEntry extends React.Component<IEventLogEntryProps> {
    constructor(props: IEventLogEntryProps) {
        super(props);
        this.state = {};
        autobind(this);
    }

    close() {
        this.props.removeRequest(this.props.request);
    }

    render() {
        const { request, t } = this.props;

        let error = null;
        if (request.status === RequestStatus.ERROR) {
            const response = request.response as ErrorResponse;
            error = <div className="error-response-message">
                {t('common.error')}: {t('errors.' + response.message)}
            </div>
        }

        return <div className={`request notification ${alertMap[request.status]}`}>
            <div className="request-type">{t('requests.' + request.message.type, request.message)}</div>
            {error}
            <div className="remove-request delete" onClick={this.close}>x</div>
        </div>;

    }
}

export default withTranslation()(EventLogEntry);
