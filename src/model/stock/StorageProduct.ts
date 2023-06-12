export class StorageProduct {
    private storageProductId: string;
    private productId: string;
    private storageId: string;
    private name: string;
    private quantity: number;
    private quantityQuantifier: string;
    private quantifierName: string;

    constructor(storageProductId: string, productId: string, storageId: string, name: string, quantity: number, quantityQuantifier: string, quantifierName: string) {
        this.storageProductId = storageProductId;
        this.productId = productId;
        this.storageId = storageId;
        this.name = name;
        this.quantity = quantity;
        this.quantityQuantifier = quantityQuantifier;
        this.quantifierName = quantifierName;
    }
}
