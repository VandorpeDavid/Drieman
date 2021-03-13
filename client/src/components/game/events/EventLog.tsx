import React from 'react';
import DriemanEvent from 'shared/dist/events/DriemanEvent';
import EventLogEntry from './EventLogEntry';
import "./EventLog.css";

interface IEventLogProps {
  events: DriemanEvent[],
}


class EventLog extends React.Component<IEventLogProps> {
  constructor(props: IEventLogProps) {
    super(props);
    this.state = {};
  }


  render() {
    return <div className="events-log">
      {
        this.props.events.slice().reverse().map((event, index) => <EventLogEntry event={event} key={index} />)
      }
    </div>
  }
}

export default EventLog;
