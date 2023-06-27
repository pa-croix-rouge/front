import {deleteWithToken, getWithToken, postWithoutToken, putWithToken} from "./Controller";
import {Beneficiary} from "../model/Beneficiaries/Beneficiary";
import {VolunteerRegistration} from "../model/volunteer/VolunteerRegistration";
import {BeneficiaryRegistration} from "../model/Beneficiaries/BeneficiaryRegistration";


export const getBeneficiaries = async (): Promise<Beneficiary[]> => {
    const response = await getWithToken(`beneficiaries`);

    if (!response.ok) {
        throw new Error(`Fetching beneficiaries failed with status ${response.status}`);
    }

    const data = await response.json();

    return data.map((beneficiary: any) => new Beneficiary(beneficiary.id, beneficiary.username, beneficiary.firstName, beneficiary.lastName, beneficiary.birthDate, beneficiary.phoneNumber, beneficiary.isValidated, beneficiary.localUnitId));
}

export const registerBeneficiary = async (beneficiaryRegistration: BeneficiaryRegistration): Promise<void> => {
    const response = await postWithoutToken(`beneficiaries/register`, beneficiaryRegistration);

    if (!response.ok) {
        throw new Error(`Registering beneficiary failed with status ${response.status}`);
    }

    return;
}

export const updateBeneficiary = async (beneficiaryId: string, beneficiary: Beneficiary)  => {
    const response = await putWithToken(`beneficiaries/${beneficiaryId}`, beneficiary);

    if (!response.ok) {
        throw new Error(`Deleting beneficiary failed with status ${response.status}`);
    }
}

export const deleteBeneficiary = async (beneficiaryId: string): Promise<boolean> => {
    const response = await deleteWithToken(`beneficiaries/${beneficiaryId}`);

    if (!response.ok) {
        throw new Error(`Deleting beneficiary failed with status ${response.status}`);
    }

    return true;
}