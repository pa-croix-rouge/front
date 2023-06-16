import {getWithToken, postWithToken} from "./Controller";
import {Stockage} from "../model/stock/Stockage";
import {ProductList} from "../model/stock/ProductList";
import {ClothStorageProduct} from "../model/stock/ClothStorageProduct";
import {StorageProduct} from "../model/stock/StorageProduct";
import {FoodStorageProduct} from "../model/stock/FoodStorageProduct";

const mapJsonToClothStorageProduct = (data: any): ClothStorageProduct[] => {
    const cloths: ClothStorageProduct[] =  data.map((clothJson: any) => {
        return new ClothStorageProduct(
            clothJson.id,
            new StorageProduct(
                clothJson.storageProductId,
                clothJson.productId,
                clothJson.storageId,
                clothJson.productName,
                clothJson.quantity,
                clothJson.quantifierQuantity,
                clothJson.quantifierName),
            clothJson.size);
    });
    return cloths;
}

const mapJsonToFoodStorageProduct = (data: any): FoodStorageProduct[] => {
    return data.map((foodJson: any) => {
        return new FoodStorageProduct(
            foodJson.id,
            new StorageProduct(
                foodJson.storageProductId,
                foodJson.productId,
                foodJson.storageId,
                foodJson.productName,
                foodJson.quantity,
                foodJson.quantifierQuantity,
                foodJson.quantifierName),
            foodJson.foodConservation,
            foodJson.expirationDate,
            foodJson.optimalConsumptionDate,
            foodJson.price);
    });
}

export const getStockages = async (): Promise<Stockage[]> => {
    const response = await getWithToken(`storage`);

    if (!response.ok) {
        throw new Error(`Fetching storages failed with status ${response.status}`);
    }

    return await response.json();
}

export const createStockage = async (name: string, localUnitID: string, departmentCode: string, postalCode: string, city: string, streetNumberAndName: string): Promise<boolean> => {
    const response = await postWithToken(`storage`, {
        name: name,
        localUnitID: localUnitID,
        address: {
            departmentCode: departmentCode,
            postalCode: postalCode,
            city: city,
            streetNumberAndName: streetNumberAndName,
        }
    });

    if (!response.ok) {
        throw new Error(`Creating storage failed with status ${response.status}`);
    }

    return true;
}

export const getAllProducts = async (): Promise<ProductList> => {
    const response = await getWithToken(`storage/product/localunit`);

    if (!response.ok) {
        throw new Error(`Fetching products failed with status ${response.status}`);
    }

    const data = await response.json();

    return new ProductList(mapJsonToClothStorageProduct(data.clothProducts), mapJsonToFoodStorageProduct(data.foodProducts));
}
