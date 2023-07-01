import {deleteWithToken, getWithToken, postWithToken, putWithToken} from "./Controller";
import {ProductLimit} from "../model/ProductLimit";

export const createProductLimit = async (dto: ProductLimit) => {
    const response = await postWithToken(`product-limit`, dto);

    if (!response.ok) {
        throw new Error(`Adding food product failed with status ${response.status}`);
    }

    return await response.json();
}

export const updateProductLimit = async (dto: ProductLimit) => {
    const response = await putWithToken(`product-limit/${dto.id}`, dto);

    if (!response.ok) {
        throw new Error(`Adding food product failed with status ${response.status}`);
    }
}


export const getAllProductLimit = async () => {
    const response = await getWithToken(`product-limit`);

    if (!response.ok) {
        throw new Error(`Adding food product failed with status ${response.status}`);
    }

    return await response.json();
}

export const getAllProductLimitProducts = async (id: string) => {
    const response = await getWithToken(`product-limit/${id}/products`);

    if (!response.ok) {
        throw new Error(`Adding food product failed with status ${response.status}`);
    }

    return await response.json();
}

export const deleteProductLimit = async (id: string): Promise<void> => {
    const response = await deleteWithToken(`product-limit/${id}`);

    if (!response.ok) {
        throw new Error(`Adding food product failed with status ${response.status}`);
    }
}

