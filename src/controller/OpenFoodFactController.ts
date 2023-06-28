import {OpenFoodFactProduct} from "../model/stock/OpenFoodFactProduct";

export const readFromBarCode = async (barCode: string): Promise<any> => {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Reading from barcode failed with status ${response.status}`);
    }

    const data = await response.json();
    const [day, month, year] = data.product.expiration_date.split("/").map(Number);

    return new OpenFoodFactProduct(
        data.product.brands + ' ' + data.product.product_name,
        new Date(year, month - 1, day),
        Number(data.product.quantity.split(" ")[0]),
        data.product.quantity.split(" ")[1]);
}
