import {ClothStorageProduct} from "./ClothStorageProduct";
import {FoodStorageProduct} from "./FoodStorageProduct";

export class ProductList {
    clothes: ClothStorageProduct[];
    foods: FoodStorageProduct[];

    constructor(clothes: ClothStorageProduct[], foods: FoodStorageProduct[]) {
        this.clothes = clothes;
        this.foods = foods;
    }
}
