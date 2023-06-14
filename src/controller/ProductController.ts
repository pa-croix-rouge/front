import {MeasurementUnit} from "../model/stock/MeasurementUnit";
import {getWithToken, postWithToken} from "./Controller";
import {CreateFoodProduct} from "../model/stock/CreateFoodProduct";

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

export const createFoodProduct = async (name: string, quantity: number, measurementUnit: string, foodConservation: string, expirationDate: Date, optimalConsumptionDate: Date, price: number, storageId: string, amount: number): Promise<void> => {
    const response = await postWithToken(`product/food`, new CreateFoodProduct(name, quantity, measurementUnit, foodConservation, expirationDate, optimalConsumptionDate, price, storageId, amount));

    if (!response.ok) {
        throw new Error(`Adding food product failed with status ${response.status}`);
    }

    return await response.json();
}
