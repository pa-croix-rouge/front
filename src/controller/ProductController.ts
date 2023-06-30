import {MeasurementUnit} from "../model/stock/MeasurementUnit";
import {deleteWithToken, getWithToken, postWithToken} from "./Controller";
import {CreateFoodProduct} from "../model/stock/CreateFoodProduct";
import {CreateClothProduct} from "../model/stock/CreateClothProduct";

export const getMeasurementUnits = async (): Promise<MeasurementUnit[]> => {
    const response = await getWithToken(`product/units`);

    if (!response.ok) {
        throw new Error(`Fetching measurement units failed with status ${response.status}`);
    }

    const data = await response.json();

    const unitMap = new Map<string, string[]>();

    for (const [unit, category] of Object.entries(data.units)) {
        if (unitMap.has(category as string)) {
            unitMap.get(category as string).push(unit);
        } else {
            unitMap.set(category as string, [unit]);
        }
    }

    return Array.from(unitMap, ([label, units]) => new MeasurementUnit(label, units));
}

export const getConservations = async (): Promise<string[]> => {
    const response = await getWithToken(`product/conservations`);

    if (!response.ok) {
        throw new Error(`Fetching conservations failed with status ${response.status}`);
    }

    return await response.json();
}

export const getSizes = async (): Promise<string[]> => {
    const response = await getWithToken(`product/sizes`);

    if (!response.ok) {
        throw new Error(`Fetching sizes failed with status ${response.status}`);
    }

    return await response.json();
}

export const getGenders = async (): Promise<string[]> => {
    const response = await getWithToken(`product/genders`);

    if (!response.ok) {
        throw new Error(`Fetching sizes failed with status ${response.status}`);
    }

    return await response.json();
}

export const createFoodProduct = async (name: string, quantity: number, measurementUnit: string, foodConservation: string, expirationDate: Date, optimalConsumptionDate: Date, price: number, storageId: string, amount: number, limitID: string): Promise<void> => {
    const response = await postWithToken(`product/food`, new CreateFoodProduct(name, quantity, measurementUnit, foodConservation, expirationDate, optimalConsumptionDate, price, storageId, amount, limitID));

    if (!response.ok) {
        throw new Error(`Adding food product failed with status ${response.status}`);
    }

    return await response.json();
}

export const createClothProduct = async (name: string, quantity: number, size: string, storageId: string, amount: number, gender: string, limitID: string): Promise<void> => {
    const response = await postWithToken(`product/cloth`, new CreateClothProduct(name, quantity, size, storageId, amount, gender, limitID));

    if (!response.ok) {
        throw new Error(`Adding cloth product failed with status ${response.status}`);
    }

    return await response.json();
}

export const updateFoodProduct = async (id: string, name: string, quantity: number, measurementUnit: string, foodConservation: string, expirationDate: Date, optimalConsumptionDate: Date, price: number, storageId: string, amount: number, limitID: string): Promise<void> => {
    const response = await postWithToken(`product/food/${id}`, new CreateFoodProduct(name, quantity, measurementUnit, foodConservation, expirationDate, optimalConsumptionDate, price, storageId, amount, limitID));

    if (!response.ok) {
        throw new Error(`Updating food product failed with status ${response.status}`);
    }

    return await response.json();
}

export const updateClothProduct = async (id: string, name: string, quantity: number, size: string, storageId: string, amount: number, gender: string, limitID: string): Promise<void> => {
    const response = await postWithToken(`product/cloth/${id}`, new CreateClothProduct(name, quantity, size, storageId, amount, gender, limitID));

    if (!response.ok) {
        throw new Error(`Updating cloth product failed with status ${response.status}`);
    }

    return await response.json();
}

export const deleteFoodProduct = async (id: string): Promise<void> => {
    const response = await deleteWithToken(`product/food/${id}`);

    if (!response.ok) {
        throw new Error(`Deleting food product failed with status ${response.status}`);
    }

    return;
}

export const deleteClothProduct = async (id: string): Promise<void> => {
    const response = await deleteWithToken(`product/cloth/${id}`);

    if (!response.ok) {
        throw new Error(`Deleting cloth product failed with status ${response.status}`);
    }

    return;
}
