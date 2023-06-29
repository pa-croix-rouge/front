export class ClothProductResponse {

    public id: string;
    private productId: number;
    private name: string;
    public size: string;

    private measurementUnit: string;
    private value: number;


    constructor(id: string, productId: number, name: string, size: string, measurementUnit: string, value: number) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.size = size;
        this.measurementUnit = measurementUnit;
        this.value = value;
    }
}