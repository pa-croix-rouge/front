export class Quantifier {

    public measurementUnit: string;
    public value: number;

    constructor(measurementUnit: string, value: number) {
        this.measurementUnit = measurementUnit;
        this.value = value;
    }
}