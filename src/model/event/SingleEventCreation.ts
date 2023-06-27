export class SingleEventCreation {
    public name: string;
    public description: string;
    public start: Date;
    public referrerId: string;
    public localUnitId: string;
    public eventTimeWindowDuration: number;
    public eventTimeWindowOccurrence: number;
    public eventTimeWindowMaxParticipants: number;

    constructor(name: string, description: string, start: Date, referrerId: string, localUnitId: string, eventTimeWindowDuration: number, eventTimeWindowOccurrence: number, eventTimeWindowMaxParticipants: number) {
        this.name = name;
        this.description = description;
        this.start = start;
        this.referrerId = referrerId;
        this.localUnitId = localUnitId;
        this.eventTimeWindowDuration = eventTimeWindowDuration;
        this.eventTimeWindowOccurrence = eventTimeWindowOccurrence;
        this.eventTimeWindowMaxParticipants = eventTimeWindowMaxParticipants;
    }
}
