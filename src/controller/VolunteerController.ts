import {Volunteer} from "../model/Volunteer";
import {getWithToken} from "./Controller";

export const getMyProfile = async (): Promise<Volunteer> => {
    const response = await getWithToken(`volunteer/token`);

    if (!response.ok) {
        throw new Error(`Fetching my profile failed with status ${response.status}`);
    }

    const data = await response.json();

    return new Volunteer(data.username, data.firstName, data.lastName, data.phoneNumber, data.isValidated, data.localUnitId);
}

export const getVolunteerById = async (volunteerId: string): Promise<Volunteer> => {
    const response = await getWithToken(`volunteer/${volunteerId}`);

    if (!response.ok) {
        throw new Error(`Fetching volunteer failed with status ${response.status}`);
    }

    const data = await response.json();

    return new Volunteer(data.username, data.firstName, data.lastName, data.phoneNumber, data.isValidated, data.localUnitId);
}
