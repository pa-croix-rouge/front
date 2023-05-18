export class Event {
    public eventId: string;
    public sessionId: string;
    public name: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public referrerId: string;
    public localUnitId: string;
    public maxParticipants: number;
    public numberOfParticipants: number;

    constructor(eventId: string, sessionId: string, name: string, description: string, startDate: Date, endDate: Date, referrerId: string, localUnitId: string, maxParticipants: number, numberOfParticipants: number) {
        this.eventId = eventId;
        this.sessionId = sessionId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.referrerId = referrerId;
        this.localUnitId = localUnitId;
        this.maxParticipants = maxParticipants;
        this.numberOfParticipants = numberOfParticipants;
    }
}
