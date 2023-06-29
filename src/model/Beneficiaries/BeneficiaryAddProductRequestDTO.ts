export class BeneficiaryAddProductRequestDTO{

    public beneficiaryId: string;

    public storageProductId: string;

    public quantity: number;

    public date: Date;


    constructor(beneficiaryID: string, storageProductID: string, quantity: number, date: Date) {
        this.beneficiaryId = beneficiaryID;
        this.storageProductId = storageProductID;
        this.quantity = quantity;
        this.date = date;
    }
}