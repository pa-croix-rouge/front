export class ProductsStats {
    public totalFoodQuantity: number;
    public totalClothesQuantity: number;
    public soonExpiredFood: number;

    constructor(totalFoodQuantity: number, totalClothesQuantity: number, soonExpiredFood: number) {
        this.totalFoodQuantity = totalFoodQuantity;
        this.totalClothesQuantity = totalClothesQuantity;
        this.soonExpiredFood = soonExpiredFood;
    }
}
