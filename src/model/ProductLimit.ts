import {Address} from "./Address";
import {Quantifier} from "./Quantifier";

export class ProductLimit {
    public id: string;
    public name: string;

    public duration: number;
    public quantity: Quantifier;


    constructor(id: string, name: string, duration: number, quantity: Quantifier) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.quantity = quantity;
    }
}