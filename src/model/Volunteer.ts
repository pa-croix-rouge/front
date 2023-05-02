export class Volunteer {
    public username: string;
    public firstName: string;
    public lasName: string;
    public phoneNumber: string;
    public isValidated: boolean;
    public localUnitId: string;

    constructor(username: string, firstName: string, lastName: string, phoneNumber: string, isValidated: boolean, localUnitId: string) {
        this.username = username;
        this.firstName = firstName;
        this.lasName = lastName;
        this.phoneNumber = phoneNumber;
        this.isValidated = isValidated;
        this.localUnitId = localUnitId;
    }
}
