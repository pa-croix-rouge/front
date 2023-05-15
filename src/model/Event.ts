export class Event {
    public name: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public referrerId: string;
    public localUnitId: string;
    public maxParticipants: number;
    public numberOfParticipants: number;

    constructor(name: string, description: string, startDate: Date, endDate: Date, referrerId: string, localUnitId: string, maxParticipants: number, numberOfParticipants: number) {
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
