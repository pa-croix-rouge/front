export class CreateFoodProduct {
    private name: string;
    private quantity = {
        measurementUnit: "",
        value: 0,
    }
    private foodConservation: string;
    private expirationDate: number;
    private optimalConsumptionDate: number;
    private price: number;
    private storageId: string;
    private amount: number;
    private limitID: string;


    constructor(name: string, quantity: number, measurementUnit: string, foodConservation: string, expirationDate: Date, optimalConsumptionDate: Date, price: number, storageId: string, amount: number, limitID: string) {
        this.name = name;
        this.quantity.value = quantity;
        this.quantity.measurementUnit = measurementUnit;
        this.foodConservation = foodConservation;
        this.expirationDate = expirationDate.getTime();
        this.optimalConsumptionDate = optimalConsumptionDate.getTime();
        this.price = price;
        this.storageId = storageId;
        this.amount = amount;
        this.limitID = limitID === "" ? null : limitID;
    }
}
