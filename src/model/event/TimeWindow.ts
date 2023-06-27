export class TimeWindow {
    public timeWindowId: string;
    public startTime: Date;
    public endTime: Date;
    public maxParticipants: number;
    public participants: string[];

    constructor(timeWindowId: string, startTime: Date, endTime: Date, maxParticipants: number, participants: string[]) {
        this.timeWindowId = timeWindowId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxParticipants = maxParticipants;
        this.participants = participants;
    }
}
