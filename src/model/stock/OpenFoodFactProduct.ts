export class OpenFoodFactProduct {
    private name: string;
    private expirationDate: Date;
    private quantityQuantifier: number;
    private quantifierName: string;

    constructor(name: string, expirationDate: Date, quantityQuantifier: number, quantifierName: string) {
        this.name = name;
        this.expirationDate = expirationDate;
        this.quantityQuantifier = quantityQuantifier;
        this.quantifierName = quantifierName;
    }
}
