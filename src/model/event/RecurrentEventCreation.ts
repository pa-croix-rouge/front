export class RecurrentEventCreation {
    public name: string;
    public description: string;
    public referrerId: string;
    public localUnitId: string;
    public firstStart: number;
    public firstEnd: number;
    public frequency: number;
    public eventTimeWindowDuration;
    public eventTimeWindowOccurrence;
    public eventTimeWindowMaxParticipants;

    constructor(name: string, description: string, referrerId: string, localUnitId: string, firstStart: number, firstEnd: number, frequency: number, eventTimeWindowDuration, eventTimeWindowOccurrence, eventTimeWindowMaxParticipants) {
        this.name = name;
        this.description = description;
        this.referrerId = referrerId;
        this.localUnitId = localUnitId;
        this.firstStart = firstStart;
        this.firstEnd = firstEnd;
        this.frequency = frequency;
        this.eventTimeWindowDuration = eventTimeWindowDuration;
        this.eventTimeWindowOccurrence = eventTimeWindowOccurrence;
        this.eventTimeWindowMaxParticipants = eventTimeWindowMaxParticipants;
    }
}
