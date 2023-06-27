export class ProductsStats {
    public totalFoodQuantity: number;
    public totalClothesQuantity: number;

    constructor(totalFoodQuantity: number, totalClothesQuantity: number) {
        this.totalFoodQuantity = totalFoodQuantity;
        this.totalClothesQuantity = totalClothesQuantity;
    }
}
