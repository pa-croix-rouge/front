import {deleteWithToken, getWithToken, postWithToken} from "./Controller";
import {Stockage} from "../model/stock/Stockage";
import {ProductList} from "../model/stock/ProductList";
import {ClothStorageProduct} from "../model/stock/ClothStorageProduct";
import {StorageProduct} from "../model/stock/StorageProduct";
import {FoodStorageProduct} from "../model/stock/FoodStorageProduct";
import {ProductsStats} from "../model/stock/ProductsStats";
import {ProductLimit} from "../model/ProductLimit";
import {Quantifier} from "../model/Quantifier";

const convertDate = (date: string): Date => {
    const startDateParts = date.split(/[\-\+:\[\]]/);
    const yearStartDate = parseInt(startDateParts[0]);
    const monthStartDate = parseInt(startDateParts[1]) - 1;
    const dayStartDate = parseInt(startDateParts[2].split("T")[0]);
    const hourStartDate = parseInt(startDateParts[2].split("T")[1]);
    const minuteStartDate = parseInt(startDateParts[3]);
    const timeZoneOffsetStartDate = parseInt(startDateParts[4]);
    return new Date(Date.UTC(yearStartDate, monthStartDate, dayStartDate, hourStartDate, minuteStartDate) - timeZoneOffsetStartDate * 60 * 60 * 1000);
}

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
                clothJson.quantifierName,
                clothJson.limit == null ? null :
                new ProductLimit(clothJson.limit.id,
                    clothJson.limit.name,
                    clothJson.limit.duration,
                    new Quantifier(clothJson.limit.quantity.measurementUnit, clothJson.limit.quantity.value))),
            clothJson.size,
            clothJson.gender);
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
                foodJson.quantifierName,
                foodJson.limit == null ? null :
                new ProductLimit(foodJson.limit.id,
                    foodJson.limit.name,
                    foodJson.limit.duration,
                    new Quantifier(foodJson.limit.quantity.measurementUnit, foodJson.limit.quantity.value))),
            foodJson.foodConservation,
            convertDate(foodJson.expirationDate),
            convertDate(foodJson.optimalConsumptionDate),
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

export const updateStockage = async (id: string, name: string, localUnitID: string, departmentCode: string, postalCode: string, city: string, streetNumberAndName: string): Promise<boolean> => {
    const response = await postWithToken(`storage/${id}`, {
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
        throw new Error(`Updating storage failed with status ${response.status}`);
    }

    return true;
}

export const deleteStockage = async (id: string): Promise<boolean> => {
    const response = await deleteWithToken(`storage/${id}`);

    if (!response.ok) {
        throw new Error(`Deleting storage failed with status ${response.status}`);
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

export const getProductsByStorage = async (storageId: string): Promise<ProductList> => {
    const response = await getWithToken(`storage/product/${storageId}`);

    if (!response.ok) {
        throw new Error(`Fetching products failed with status ${response.status}`);
    }

    const data = await response.json();

    return new ProductList(mapJsonToClothStorageProduct(data.clothProducts), mapJsonToFoodStorageProduct(data.foodProducts));
}

export const getProductsStats = async (): Promise<ProductsStats> => {
    const response = await getWithToken(`storage/product/stats`);

    if (!response.ok) {
        throw new Error(`Fetching products stats failed with status ${response.status}`);
    }

    const data = await response.json();

    return new ProductsStats(data.totalFoodQuantity, data.totalClothesQuantity, data.soonExpiredFood);
}

export const getSoonExpiredFood = async (): Promise<FoodStorageProduct[]> => {
    const response = await getWithToken(`product/food/expired`);

    if (!response.ok) {
        throw new Error(`Fetching soon expired food failed with status ${response.status}`);
    }

    const data = await response.json();

    return mapJsonToFoodStorageProduct(data);
}
