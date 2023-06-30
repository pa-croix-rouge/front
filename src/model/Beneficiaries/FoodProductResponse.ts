import {StorageProduct} from "../stock/StorageProduct";

export class FoodProductResponse {

    public id: string;
    private productId: number;
    private name: string;
    public conservation: string;
    public expirationDate: Date;
    public optimalConsumptionDate: Date;
    public price: number;
    private measurementUnit: string;
    private value: number;

    constructor(id: string, productId: number, name: string, conservation: string, expirationDate: Date, optimalConsumptionDate: Date, price: number, measurementUnit: string, value: number) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.conservation = conservation;
        this.expirationDate = expirationDate;
        this.optimalConsumptionDate = optimalConsumptionDate;
        this.price = price;
        this.measurementUnit = measurementUnit;
        this.value = value;
    }
}