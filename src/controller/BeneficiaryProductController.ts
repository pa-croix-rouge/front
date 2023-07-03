import {getWithToken, postWithToken} from "./Controller";
import {BeneficiaryAddProductRequestDTO} from "../model/Beneficiaries/BeneficiaryAddProductRequestDTO";
import {BeneficiaryProductCounterResponse} from "../model/Beneficiaries/BeneficiaryProductCounterResponse";
import {FoodProductResponse} from "../model/Beneficiaries/FoodProductResponse";
import {ClothProductResponse} from "../model/Beneficiaries/ClothProductResponse";

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

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

export const addProductToBeneficiary = async (dto: BeneficiaryAddProductRequestDTO): Promise<void> => {
    const response = await postWithToken(`product/beneficiary/add`, dto);

    if (!response.ok) {
        throw new Error(`Registering beneficiary failed with status ${response.status}`);
    }

    return;
}

export const getAllBeneficiaryProduct = async (beneficiaryID: string, from: Date, to: Date) => {
    const response = await getWithToken(`product/beneficiary/${beneficiaryID}?from=${formatDate(from)}&to=${formatDate(to)}`,);

    if (!response.ok) {
        throw new Error(`Registering beneficiary failed with status ${response.status}`);
    }

    const data = await response.json();
    const foods = new Map();
    const cloths = new Map();
    Object.entries(data.foodProducts).forEach(([key, value]) => {
        const json = JSON.parse(key);
        foods.set(new FoodProductResponse(json.id, json.productId, json.name, json.foodConservation, convertDate(json.expirationDate), convertDate(json.optimalConsumptionDate), json.price, json.quantity.measurementUnit, json.quantity.value)
            , value);
    });

    Object.entries(data.clothProducts).forEach(([key, value]) => {
        const json = JSON.parse(key);
        cloths.set(new ClothProductResponse(json.id, json.productId, json.name, json.size, json.quantity.measurementUnit, json.quantity.value)
            , value);
    });

    return new BeneficiaryProductCounterResponse(foods, cloths);
}

export const getAllBeneficiaryProductQuantity = async (beneficiaryID: string, from: Date, to: Date) => {
    const response = await getWithToken(`product/beneficiary/${beneficiaryID}?from=${formatDate(from)}&to=${formatDate(to)}`,);

    if (!response.ok) {
        throw new Error(`Registering beneficiary failed with status ${response.status}`);
    }

    return await response.json();
}

