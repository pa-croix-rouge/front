export class Department {
    public code: string;
    public name: string;

    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }

    public toString(): string {
        return this.code + ' - ' + this.name;
    }
}
