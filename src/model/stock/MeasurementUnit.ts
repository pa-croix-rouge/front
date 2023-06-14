export class MeasurementUnit {
    private label: string;
    private units: string[];

    constructor(label: string, units: string[]) {
        this.label = label;
        this.units = units;
    }
}
