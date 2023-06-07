import {getWithToken, postWithToken} from "./Controller";
import {Stockage} from "../model/stock/Stockage";

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
