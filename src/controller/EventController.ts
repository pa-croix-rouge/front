import {Event} from "../model/Event";
import {getWithToken} from "./Controller";
import {EventsStats} from "../model/EventsStats";

export const getAllEvents = async (localUnitId: string): Promise<Event[]> => {
    const response = await getWithToken(`event/all/${localUnitId}`);

    if (!response.ok) {
        throw new Error(`Fetching events failed with status ${response.status}`);
    }

    const data = await response.json();

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
        return new Event(event.name, event.description, startDate, endDate, event.referrerId, event.localUnitId, event.maxParticipants, event.numberOfParticipants);
    });
}

export const getEventsStats = async (localUnitId: string): Promise<EventsStats> => {
    const response = await getWithToken(`event/stats/${localUnitId}`);

    if (!response.ok) {
        throw new Error(`Fetching events stats failed with status ${response.status}`);
    }

    const data = await response.json();

    return new EventsStats(data.numberOfEventsOverTheMonth, data.totalParticipantsOverTheMonth, data.numberOfEventsOverTheYear, data.totalParticipantsOverTheYear);
}
