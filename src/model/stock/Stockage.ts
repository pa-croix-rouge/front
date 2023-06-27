import {Address} from "../Address";

export class Stockage {
    private id: string;
    private name: string;
    private address: Address;
    private localUnitId: string;

    constructor(id: string, name: string, address: Address, localUnitId: string) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.localUnitId = localUnitId;
    }
}
