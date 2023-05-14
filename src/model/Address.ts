export class Address {
    public departmentNumber: string;
    public postalCode: string;
    public city: string;
    public streetNumberAndName: string;

    constructor(departmentNumber: string, postalCode: string, city: string, streetNumberAndName: string) {
        this.departmentNumber = departmentNumber;
        this.postalCode = postalCode;
        this.city = city;
        this.streetNumberAndName = streetNumberAndName;
    }
}
