import React from 'react';
import DriemanEvent from 'shared/dist/events/DriemanEvent';
import EventLogEntry from './EventLogEntry';

interface IEventLogProps {
  events: DriemanEvent[],
}


class EventLog extends React.Component<IEventLogProps> {
  constructor(props: IEventLogProps) {
    super(props);
    this.state = {};
  }


  render() {
    return <div>
      {
        this.props.events.map((event, index) => <EventLogEntry event={event} key={index} />)
      }
    </div>
  }
}

export default EventLog;
