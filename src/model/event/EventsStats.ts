export class EventsStats {
    public numberOfEventsOverTheMonth: number;
    public totalParticipantsOverTheMonth: number;
    public numberOfEventsOverTheYear: number;
    public totalParticipantsOverTheYear: number;

    constructor(numberOfEventsOverTheMonth: number, totalParticipantsOverTheMonth: number, numberOfEventsOverTheYear: number, totalParticipantsOverTheYear: number) {
        this.numberOfEventsOverTheMonth = numberOfEventsOverTheMonth;
        this.totalParticipantsOverTheMonth = totalParticipantsOverTheMonth;
        this.numberOfEventsOverTheYear = numberOfEventsOverTheYear;
        this.totalParticipantsOverTheYear = totalParticipantsOverTheYear;
    }
}
