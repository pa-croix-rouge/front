import {ProductLimit} from "../ProductLimit";

export class StorageProduct {
    private storageProductId: string;
    private productId: string;
    private storageId: string;
    private name: string;
    private quantity: number;
    private quantityQuantifier: string;
    private quantifierName: string;
    private productLimit: ProductLimit;


    constructor(storageProductId: string, productId: string, storageId: string, name: string, quantity: number, quantityQuantifier: string, quantifierName: string, productLimit: ProductLimit) {
        this.storageProductId = storageProductId;
        this.productId = productId;
        this.storageId = storageId;
        this.name = name;
        this.quantity = quantity;
        this.quantityQuantifier = quantityQuantifier;
        this.quantifierName = quantifierName;
        this.productLimit = productLimit;
    }
}
