import {Token} from "../model/Token";
import {useContext} from "react";
import TokenContext from "../contexts/TokenContext";
import {LocalUnit} from "../model/LocalUnit";
import {Address} from "../model/Address";

const { API_URL } = require('env');

export const getLocalUnit = async (id: string): Promise<LocalUnit> => {
    const {token}: Token = useContext(TokenContext) as unknown as Token;

    const response = await fetch(`${API_URL}/localunit/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Fetching local unit failed with status ${response.status}`);
    }

    const data = await response.json();

    return new LocalUnit(data.id, data.name, new Address(data.address.departmentCode, data.address.postalCode, data.address.city, data.address.streetNumberAndName), data.managerName, data.code);
}
