import React from 'react';
import './RequestLog.css';
import RequestLogEntry from './RequestLogEntry';
import { ISentRequest } from './RequestLogEntry';
export { RequestStatus } from './RequestLogEntry';
export type { ISentRequest } from './RequestLogEntry';

interface IRequestsOverlayProps {
  requests: ISentRequest[],
  removeRequest: (request: ISentRequest) => void
}


class RequestsOverlay extends React.Component<IRequestsOverlayProps> {
  constructor(props: IRequestsOverlayProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="request-log">
      {
        this.props.requests.map((request) => <RequestLogEntry request={request} removeRequest={this.props.removeRequest} key={request.message.id} />)
      }
    </div>
  }
}

export default RequestsOverlay;
