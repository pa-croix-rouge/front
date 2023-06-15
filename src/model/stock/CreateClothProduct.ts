export class CreateClothProduct {
    private name: string;
    private quantity = {
        measurementUnit: "",
        value: 0,
    }
    private size: string;
    private storageId: string;
    private amount: number;

    constructor(name: string, quantity: number, size: string, storageId: string, amount: number) {
        this.name = name;
        this.quantity.value = quantity;
        this.quantity.measurementUnit = "pièce";
        this.size = size;
        this.storageId = storageId;
        this.amount = amount;
    }
}
