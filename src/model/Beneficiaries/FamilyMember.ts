export class FamilyMember {
    public id: string;
    public firstName: string;
    public lastName: string;
    public birthDate: Date;


    constructor(id: string, firstName: string, lastName: string, birthDate: Date) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
    }
}
