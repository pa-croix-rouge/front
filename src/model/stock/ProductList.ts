import {ClothStorageProduct} from "./ClothStorageProduct";
import {FoodStorageProduct} from "./FoodStorageProduct";

export class ProductList {
    private clothes: ClothStorageProduct[];
    private foods: FoodStorageProduct[];

    constructor(clothes: ClothStorageProduct[], foods: FoodStorageProduct[]) {
        this.clothes = clothes;
        this.foods = foods;
    }
}
