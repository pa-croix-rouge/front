import {FoodProductResponse} from "./FoodProductResponse";
import {ClothProductResponse} from "./ClothProductResponse";

export class BeneficiaryProductCounterResponse {

    public  foodProducts : Map<FoodProductResponse, number>;
    public  clothProducts :Map<ClothProductResponse, number>;

    constructor(foodProducts: Map<FoodProductResponse, number>, clothProducts: Map<ClothProductResponse, number>) {
        this.foodProducts = foodProducts;
        this.clothProducts = clothProducts;
    }
}
