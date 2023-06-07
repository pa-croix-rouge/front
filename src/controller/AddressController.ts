import {Department} from "../model/Department";
import {getWithToken} from "./Controller";

export const getAllDepartment = async (): Promise<Department[]> => {
    const response = await getWithToken(`address/department`);

    if (!response.ok) {
        throw new Error(`Fetching departments failed with status ${response.status}`);
    }

    return await response.json();
}
