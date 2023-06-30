import {FoodConservation} from "./FoodConservation";
import {StorageProduct} from "./StorageProduct";

export class FoodStorageProduct {
    public id: string;
    public product: StorageProduct;
    public conservation: FoodConservation;
    public expirationDate: Date;
    public optimalConsumptionDate: Date;
    public price: number;

    constructor(id: string, product: StorageProduct, conservation: FoodConservation, expirationDate: Date, optimalConsumptionDate: Date, price: number) {
        this.id = id;
        this.product = product;
        this.conservation = conservation;
        this.expirationDate = expirationDate;
        this.optimalConsumptionDate = optimalConsumptionDate;
        this.price = price;
    }
}
