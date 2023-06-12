import {FoodConservation} from "./FoodConservation";
import {StorageProduct} from "./StorageProduct";

export class FoodStorageProduct {
    private id: string;
    private product: StorageProduct;
    private conservation: FoodConservation;
    private expirationDate: Date;
    private optimalConsumptionDate: Date;

    constructor(id: string, product: StorageProduct, conservation: FoodConservation, expirationDate: Date, optimalConsumptionDate: Date) {
        this.id = id;
        this.product = product;
        this.conservation = conservation;
        this.expirationDate = expirationDate;
        this.optimalConsumptionDate = optimalConsumptionDate;
    }
}
