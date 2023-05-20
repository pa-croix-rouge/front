import {Address} from "./Address";

export class LocalUnit {
    public id: string;
    public name: string;
    public address: Address;
    public managerName: string;
    public code: string;

    constructor(id: string, name: string, address: Address, managerName: string, code: string) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.managerName = managerName;
        this.code = code;
    }
}
