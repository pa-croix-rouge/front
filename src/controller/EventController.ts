import {Token} from "../model/Token";
import {Event} from "../model/Event";
import {useContext} from "react";
import TokenContext from "../contexts/TokenContext";

const { API_URL } = require('env');

export const getAllEvents = async (localUnitId: string): Promise<Event[]> => {
    const {token}: Token = useContext(TokenContext) as unknown as Token;

    const response = await fetch(`${API_URL}/event/all/${localUnitId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        redirect: 'follow',
    });

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
        return new Event(event.name, event.description, startDate, endDate, event.referrerId, event.localUnitId, event.numberOfParticipants);
    });
}
