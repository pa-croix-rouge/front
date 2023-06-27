import {createContext} from "react";

const EventContext = createContext({
    events: [],
    setEvents: () => {},
});
export default EventContext;
