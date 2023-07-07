import {FamilyMember} from "./FamilyMember";

export class Beneficiary {
    public id: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public birthDate: Date;
    public phoneNumber: string;
    public isValidated: boolean;
    public localUnitId: string;
    public familyMembers: FamilyMember[];
    public solde: number;

    constructor(id: string, username: string, firstName: string, lastName: string, birthDate: Date, phoneNumber: string, isValidated: boolean, localUnitId: string, familyMembers: FamilyMember[], solde: number) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
        this.isValidated = isValidated;
        this.localUnitId = localUnitId;
        this.familyMembers = familyMembers;
        this.solde = solde;
    }
}
