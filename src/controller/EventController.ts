import {Event} from "../model/event/Event";
import {deleteWithToken, getWithToken, postWithToken} from "./Controller";
import {EventsStats} from "../model/event/EventsStats";
import {RecurrentEventCreation} from "../model/event/RecurrentEventCreation";
import {SingleEventCreation} from "../model/event/SingleEventCreation";
import {TimeWindow} from "../model/event/TimeWindow";

const mapJsonEventToEvent = (data: any): Event[] => {
    return data.map((event: any) => {
        const startDateParts = event.start.split(/[\-\+:\[\]]/);
        const yearStartDate = parseInt(startDateParts[0]);
        const monthStartDate = parseInt(startDateParts[1]) - 1;
        const dayStartDate = parseInt(startDateParts[2].split("T")[0]);
        const hourStartDate = parseInt(startDateParts[2].split("T")[1]);
        const minuteStartDate = parseInt(startDateParts[3]);
        const timeZoneOffsetStartDate = parseInt(startDateParts[4]);
        const startDate = new Date(Date.UTC(yearStartDate, monthStartDate, dayStartDate, hourStartDate, minuteStartDate) - timeZoneOffsetStartDate * 60 * 60 * 1000);
        const endDateParts = event.end.split(/[\-\+:\[\]]/);
        const yearEndDate = parseInt(endDateParts[0]);
        const monthEndDate = parseInt(endDateParts[1]) - 1;
        const dayEndDate = parseInt(endDateParts[2].split("T")[0]);
        const hourEndDate = parseInt(endDateParts[2].split("T")[1]);
        const minuteEndDate = parseInt(endDateParts[3]);
        const timeZoneOffsetEndDate = parseInt(endDateParts[4]);
        const endDate = new Date(Date.UTC(yearEndDate, monthEndDate, dayEndDate, hourEndDate, minuteEndDate) - timeZoneOffsetEndDate * 60 * 60 * 1000);
        const timeWindows = event.timeWindows.map((timeWindow: any) => {
            const startTimeWindowParts = timeWindow.start.split(/[\-\+:\[\]]/);
            const yearStartTime = parseInt(startTimeWindowParts[0]);
            const monthStartTime = parseInt(startTimeWindowParts[1]) - 1;
            const dayStartTime = parseInt(startTimeWindowParts[2].split("T")[0]);
            const hourStartTime = parseInt(startTimeWindowParts[2].split("T")[1]);
            const minuteStartTime = parseInt(startTimeWindowParts[3]);
            const timeZoneOffsetStartTime = parseInt(startTimeWindowParts[4]);
            const startTimeWindow = new Date(Date.UTC(yearStartTime, monthStartTime, dayStartTime, hourStartTime, minuteStartTime) - timeZoneOffsetStartTime * 60 * 60 * 1000);
            const endTimeWindowParts = timeWindow.end.split(/[\-\+:\[\]]/);
            const yearEndTime = parseInt(endTimeWindowParts[0]);
            const monthEndTime = parseInt(endTimeWindowParts[1]) - 1;
            const dayEndTime = parseInt(endTimeWindowParts[2].split("T")[0]);
            const hourEndTime = parseInt(endTimeWindowParts[2].split("T")[1]);
            const minuteEndTime = parseInt(endTimeWindowParts[3]);
            const timeZoneOffsetEndTime = parseInt(endTimeWindowParts[4]);
            const endTimeWindow = new Date(Date.UTC(yearEndTime, monthEndTime, dayEndTime, hourEndTime, minuteEndTime) - timeZoneOffsetEndTime * 60 * 60 * 1000);
            return new TimeWindow(timeWindow.timeWindowId, startTimeWindow, endTimeWindow, timeWindow.maxParticipants, timeWindow.participants);
        });
        return new Event(event.eventId, event.sessionId, event.name, event.description, startDate, endDate, event.referrerId, event.localUnitId, event.maxParticipants, event.numberOfParticipants, timeWindows, event.recurring);
    });
}

export const getAllEvents = async (localUnitId: string): Promise<Event[]> => {
    const response = await getWithToken(`event/all/${localUnitId}`);

    if (!response.ok) {
        throw new Error(`Fetching events failed with status ${response.status}`);
    }

    const data = await response.json();

    return mapJsonEventToEvent(data);
}

export const getEventSessions = async (eventId: string): Promise<Event[]> => {
    const response = await getWithToken(`event/sessions/${eventId}`);

    if (!response.ok) {
        throw new Error(`Fetching event sessions failed with status ${response.status}`);
    }

    const data = await response.json();

    return mapJsonEventToEvent(data);
}

export const getEventsStats = async (): Promise<EventsStats> => {
    const response = await getWithToken(`event/stats`);

    if (!response.ok) {
        throw new Error(`Fetching events stats failed with status ${response.status}`);
    }

    const data = await response.json();

    return new EventsStats(data.numberOfEventsOverTheMonth, data.totalParticipantsOverTheMonth, data.numberOfEventsOverTheYear, data.totalParticipantsOverTheYear);
}

export const getEventForSpecificMonth = async (localUnitId: string, month: number, year: number): Promise<Event[]> => {
    const response = await getWithToken(`event/date?localUnitId=${localUnitId}&month=${month}&year=${year}`,);

    if (!response.ok) {
        throw new Error(`Fetching events for specific month failed with status ${response.status}`);
    }

    const data = await response.json();

    return mapJsonEventToEvent(data);
}

export const getEventForTrimester = async (localUnitId: string, month: number, year: number): Promise<Event[]> => {
    const response = await getWithToken(`event/trimester?localUnitId=${localUnitId}&month=${month}&year=${year}`,);

    if (!response.ok) {
        throw new Error(`Fetching events for specific month failed with status ${response.status}`);
    }

    const data = await response.json();

    return mapJsonEventToEvent(data);
}

export const createSingleEvent = async (event: SingleEventCreation) => {
    const response = await postWithToken(`event/details`, event);

    if (!response.ok) {
        throw new Error(`Creating single event failed with status ${response.status}`);
    }

    return await response.json();
}

export const createRecurrentEvent = async (event: RecurrentEventCreation) => {
    const response = await postWithToken(`event/sessions`, event);

    if (!response.ok) {
        throw new Error(`Creating recurrent event failed with status ${response.status}`);
    }

    return await response.json();
}

export const updateEventSession = async (event: Event, start: Date, end: Date, eventTimeWindowDuration: number, eventTimeWindowOccurrence: number, eventTimeWindowMaxParticipants: number): Promise<boolean> => {
    const response = await postWithToken(`event/details/${event.eventId}/${event.sessionId}`, {
        name: event.name,
        description: event.description,
        start: start.getTime(),
        referrerId: event.referrerId,
        localUnitId: event.localUnitId,
        eventTimeWindowDuration: eventTimeWindowDuration,
        eventTimeWindowOccurrence: eventTimeWindowOccurrence,
        eventTimeWindowMaxParticipants: eventTimeWindowMaxParticipants,
    });

    if (!response.ok) {
        throw new Error(`Updating event session failed with status ${response.status}`);
    }

    return true;
}

export const updateAllEventSessions = async (event: Event, start: Date, end: Date, eventTimeWindowDuration: number, eventTimeWindowOccurrence: number, eventTimeWindowMaxParticipants: number): Promise<boolean> => {
    // console.log("updateAllEventSessions params: ", event, start, end, eventTimeWindowDuration, eventTimeWindowOccurrence, eventTimeWindowMaxParticipants);
    const response = await postWithToken(`event/sessions/${event.eventId}/${event.sessionId}`, {
        name: event.name,
        description: event.description,
        start: start.getTime(),
        end: end.getTime(),
        referrerId: event.referrerId,
        localUnitId: event.localUnitId,
        eventTimeWindowDuration: eventTimeWindowDuration,
        eventTimeWindowOccurrence: eventTimeWindowOccurrence,
        eventTimeWindowMaxParticipants: eventTimeWindowMaxParticipants,
    });

    if (!response.ok) {
        throw new Error(`Updating event session failed with status ${response.status}`);
    }

    return true;
}

export const deleteEventById = async (eventId: string, sessionId: string): Promise<boolean> => {
    const response = await deleteWithToken(`event/details/${eventId}/${sessionId}`);

    if (!response.ok) {
        throw new Error(`Deleting event failed with status ${response.status}`);
    }

    return true;
}

export const deleteEventSessions = async (eventId: string): Promise<boolean> => {
    const response = await deleteWithToken(`event/sessions/${eventId}`);

    if (!response.ok) {
        throw new Error(`Deleting event sessions failed with status ${response.status}`);
    }

    return true;
}
