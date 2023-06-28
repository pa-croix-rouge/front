export class BeneficiaryRegistration{

    public username: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public phoneNumber: string;

    public localUnitCode: string;

    public birthDate: Date;

    public socialWorkerNumber: string;

    public familyMembers: [];


    constructor(username: string, password: string, firstName: string, lastName: string, phoneNumber: string, localUnitCode: string, birthDate: Date, socialWorkerNumber: string, familyMembers: []) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.localUnitCode = localUnitCode;
        this.birthDate = birthDate;
        this.socialWorkerNumber = socialWorkerNumber;
        this.familyMembers = familyMembers;
    }
}