import {Event} from "../model/event/Event";
import {deleteWithToken, getWithToken, postWithToken} from "./Controller";
import {EventsStats} from "../model/event/EventsStats";
import {RecurrentEventCreation} from "../model/event/RecurrentEventCreation";
import {SingleEventCreation} from "../model/event/SingleEventCreation";

const mapJsonEventToEvent = (data: any): Event[] => {
    return data.map((event: any) => {
        const startDateParts = event.start.split(/[\-\+:\[\]]/);
        const yearStartDate = parseInt(startDateParts[0]);
        const monthStartDate = parseInt(startDateParts[1]) - 1;
        const dayStartDate = parseInt(startDateParts[2]);
        const hourStartDate = parseInt(startDateParts[3]);
        const minuteStartDate = parseInt(startDateParts[4]);
        const timeZoneOffsetStartDate = parseInt(startDateParts[5]);
        const startDate = new Date(Date.UTC(yearStartDate, monthStartDate, dayStartDate, hourStartDate, minuteStartDate) - timeZoneOffsetStartDate * 60 * 1000);
        const endDateParts = event.end.split(/[\-\+:\[\]]/);
        const yearEndDate = parseInt(endDateParts[0]);
        const monthEndDate = parseInt(endDateParts[1]) - 1;
        const dayEndDate = parseInt(endDateParts[2]);
        const hourEndDate = parseInt(endDateParts[3]);
        const minuteEndDate = parseInt(endDateParts[4]);
        const timeZoneOffsetEndDate = parseInt(endDateParts[5]);
        const endDate = new Date(Date.UTC(yearEndDate, monthEndDate, dayEndDate, hourEndDate, minuteEndDate) - timeZoneOffsetEndDate * 60 * 1000);
        return new Event(event.eventId, event.sessionId, event.name, event.description, startDate, endDate, event.referrerId, event.localUnitId, event.maxParticipants, event.numberOfParticipants, event.recurring);
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

export const getEventsStats = async (localUnitId: string): Promise<EventsStats> => {
    const response = await getWithToken(`event/stats/${localUnitId}`);

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

export const createSingleEvent = async (event: SingleEventCreation): Promise<boolean> => {
    const response = await postWithToken(`event/details`, event);

    if (!response.ok) {
        throw new Error(`Creating single event failed with status ${response.status}`);
    }

    return true;
}

export const createRecurrentEvent = async (event: RecurrentEventCreation): Promise<boolean> => {
    const response = await postWithToken(`event/sessions`, event);

    if (!response.ok) {
        throw new Error(`Creating recurrent event failed with status ${response.status}`);
    }

    return true;
}

export const updateEventSession = async (event: Event): Promise<boolean> => {
    const response = await postWithToken(`event/details/${event.eventId}/${event.sessionId}`, {
        name: event.name,
        description: event.description,
        start: event.startDate.getTime(),
        end: event.endDate.getTime(),
        referrerId: event.referrerId,
        localUnitId: event.localUnitId,
        maxParticipants: event.maxParticipants,
    });

    if (!response.ok) {
        throw new Error(`Updating event session failed with status ${response.status}`);
    }

    return true;
}

export const updateAllEventSessions = async (event: Event): Promise<boolean> => {
    const response = await postWithToken(`event/sessions/${event.eventId}/${event.sessionId}`, {
        name: event.name,
        description: event.description,
        start: event.startDate.getTime(),
        end: event.endDate.getTime(),
        referrerId: event.referrerId,
        localUnitId: event.localUnitId,
        maxParticipants: event.maxParticipants,
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
