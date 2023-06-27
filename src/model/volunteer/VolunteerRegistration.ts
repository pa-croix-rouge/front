export class VolunteerRegistration {
    public username: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public phoneNumber: string;
    public localUnitCode: string;

    constructor(username: string, password: string, firstName: string, lastName: string, phoneNumber: string, localUnitCode: string) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.localUnitCode = localUnitCode;
    }
}
