import React from 'react';
import DriemanEvent from 'shared/dist/events/DriemanEvent';
import RollEvent from 'shared/dist/events/RollEvent';
import JoinEvent from 'shared/dist/events/PlayerJoin';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IEventLogEntryProps extends WithTranslation {
    event: DriemanEvent,
}

class EventLogEntry extends React.Component<IEventLogEntryProps> {
    constructor(props: IEventLogEntryProps) {
        super(props);
        this.state = {};
    }


    render() {
        const { event, t } = this.props;

        let effects = null;
        let drieman = null;
        let type = event.type;
        if (type === 'roll') {
            const roll = event as RollEvent;
            effects = roll.effects.map((effect, index) =>
                <div className="effect" key={index}>
                    {t('events.effect', effect)}
                </div>
            );

            if (roll.newDrieman) {
                if (roll.driemanLevel === 1) {
                    drieman = <div className="effect">
                        {t('events.drieman', roll)}
                    </div>;
                } else {
                    drieman = <div className="effect">
                        {t('events.driemanlevel', roll)}
                    </div>;
                }
            }
        } else if (type === "player_join") {
            const joinEvent = event as JoinEvent;
            if (joinEvent.rejoin) {
                type = 'player_rejoin';
            }
        }

        return <div className="event-log-entry">
            {t('events.' + event.type, event)}
            {effects}
            {drieman}
        </div>;
    }
}

export default withTranslation()(EventLogEntry);
