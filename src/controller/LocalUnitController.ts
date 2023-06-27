import {LocalUnit} from "../model/LocalUnit";
import {Address} from "../model/Address";
import {getWithToken, postWithToken} from "./Controller";
import {LocalUnitStats} from "../model/LocalUnitStats";

export const getLocalUnit = async (id: string): Promise<LocalUnit> => {
    const response = await getWithToken(`localunit/${id}`);

    if (!response.ok) {
        throw new Error(`Fetching local unit failed with status ${response.status}`);
    }

    const data = await response.json();

    return new LocalUnit(data.id, data.name, new Address(data.address.departmentCode, data.address.postalCode, data.address.city, data.address.streetNumberAndName), data.managerName, data.code);
}

export const regenerateLocalUnitCode = async (id: string): Promise<boolean> => {
    const response = await postWithToken(`localunit/secret`, {
        localUnitId: id,
    });

    if (!response.ok) {
        throw new Error(`Regenerating local unit code failed with status ${response.status}`);
    }

    return true;
}

export const getLocalUnitStats = async (): Promise<LocalUnitStats> => {
    const response = await getWithToken(`localunit/stats`);

    if (!response.ok) {
        throw new Error(`Fetching local unit stats failed with status ${response.status}`);
    }

    const data = await response.json();

    return new LocalUnitStats(data.numberOfVolunteers, data.numberOfBeneficiaries);
}
