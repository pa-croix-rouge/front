import React, { useState } from "react";
import EventContext from "../contexts/EventContext";

const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const value = { events, setEvents};

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};

export default EventProvider;
