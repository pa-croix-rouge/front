export class RecurrentEventCreation {
    public name: string;
    public description: string;
    public referrerId: string;
    public localUnitId: string;
    public firstStart: Date;
    public firstEnd: Date;
    public duration: number;
    public frequency: number;
    public maxParticipants: number;

    constructor(name: string, description: string, referrerId: string, localUnitId: string, firstStart: Date, firstEnd: Date, duration: number, frequency: number, maxParticipants: number) {
        this.name = name;
        this.description = description;
        this.referrerId = referrerId;
        this.localUnitId = localUnitId;
        this.firstStart = firstStart;
        this.firstEnd = firstEnd;
        this.duration = duration;
        this.frequency = frequency;
        this.maxParticipants = maxParticipants;
    }
}
