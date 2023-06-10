import {Volunteer} from "../model/volunteer/Volunteer";
import {deleteWithToken, getWithToken, postWithoutToken, postWithToken} from "./Controller";
import {VolunteerRegistration} from "../model/volunteer/VolunteerRegistration";

export const getMyProfile = async (): Promise<Volunteer> => {
    const response = await getWithToken(`volunteer/token`);

    if (!response.ok) {
        throw new Error(`Fetching my profile failed with status ${response.status}`);
    }

    const data = await response.json();

    return new Volunteer(data.id, data.username, data.firstName, data.lastName, data.phoneNumber, data.isValidated, data.localUnitId);
}

export const getVolunteerById = async (volunteerId: string): Promise<Volunteer> => {
    const response = await getWithToken(`volunteer/${volunteerId}`);

    if (!response.ok) {
        throw new Error(`Fetching volunteer failed with status ${response.status}`);
    }

    const data = await response.json();

    return new Volunteer(data.id, data.username, data.firstName, data.lastName, data.phoneNumber, data.isValidated, data.localUnitId);
}

export const getVolunteers = async (): Promise<Volunteer[]> => {
    const response = await getWithToken(`volunteer`);

    if (!response.ok) {
        throw new Error(`Fetching volunteers failed with status ${response.status}`);
    }

    const data = await response.json();

    return data.map((volunteer: any) => new Volunteer(volunteer.id, volunteer.username, volunteer.firstName, volunteer.lastName, volunteer.phoneNumber, volunteer.isValidated, volunteer.localUnitId));
}

export const register = async (volunteerRegistration: VolunteerRegistration): Promise<void> => {
    const response = await postWithoutToken(`volunteer/register`, volunteerRegistration);

    if (!response.ok) {
        throw new Error(`Registering volunteer failed with status ${response.status}`);
    }

    return;
}

export const validateVolunteer = async (volunteerId: string): Promise<boolean> => {
    const response = await postWithToken(`volunteer/validate/${volunteerId}`, {});

    if (!response.ok) {
        throw new Error(`Validating volunteer failed with status ${response.status}`);
    }

    return true;
}

export const invalidateVolunteer = async (volunteerId: string): Promise<boolean> => {
    const response = await postWithToken(`volunteer/invalidate/${volunteerId}`, {});

    if (!response.ok) {
        throw new Error(`Validating volunteer failed with status ${response.status}`);
    }

    return true;
}

export const deleteVolunteer = async (volunteerId: string): Promise<boolean> => {
    const response = await deleteWithToken(`volunteer/${volunteerId}`);

    if (!response.ok) {
        throw new Error(`Deleting volunteer failed with status ${response.status}`);
    }

    return true;
}
