import {StorageProduct} from "./StorageProduct";
import {ClothSize} from "./ClothSize";

export class ClothStorageProduct {
    private id: string;
    private product: StorageProduct;
    private size: ClothSize;

    constructor(id: string, product: StorageProduct, size: ClothSize) {
        this.id = id;
        this.product = product;
        this.size = size;
    }
}
