export class SingleEventCreation {
    public name: string;
    public description: string;
    public start: Date;
    public end: Date;
    public referrerId: string;
    public localUnitId: string;
    public maxParticipants: number;

    constructor(name: string, description: string, start: Date, end: Date, referrerId: string, localUnitId: string, maxParticipants: number) {
        this.name = name;
        this.description = description;
        this.start = start;
        this.end = end;
        this.referrerId = referrerId;
        this.localUnitId = localUnitId;
        this.maxParticipants = maxParticipants;
    }
}
