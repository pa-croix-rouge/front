import {StorageProduct} from "./StorageProduct";
import {ClothSize} from "./ClothSize";
import {ClothGender} from "./ClothGender";

export class ClothStorageProduct {
    private id: string;
    private product: StorageProduct;
    private size: ClothSize;
    private gender: ClothGender;

    constructor(id: string, product: StorageProduct, size: ClothSize, gender: ClothGender) {
        this.id = id;
        this.product = product;
        this.size = size;
        this.gender = gender;
    }
}
