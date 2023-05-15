import {LocalUnit} from "../model/LocalUnit";
import {Address} from "../model/Address";
import {getWithToken} from "./Controller";

export const getLocalUnit = async (id: string): Promise<LocalUnit> => {
    const response = await getWithToken(`localunit/${id}`);

    if (!response.ok) {
        throw new Error(`Fetching local unit failed with status ${response.status}`);
    }

    const data = await response.json();

    return new LocalUnit(data.id, data.name, new Address(data.address.departmentCode, data.address.postalCode, data.address.city, data.address.streetNumberAndName), data.managerName, data.code);
}
