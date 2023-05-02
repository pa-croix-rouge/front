import {Volunteer} from "../model/Volunteer";
import {useContext} from "react";
import TokenContext from "../contexts/TokenContext";
import {Token} from "../model/Token";

const { API_URL } = require('env');

export const getMyProfile = async (): Promise<Volunteer> => {
    const token: Token = useContext(TokenContext) as unknown as Token;
    console.log(token);
    const response = await fetch(`${API_URL}/volunteer/token`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Fetching my profile failed with status ${response.status}`);
    }

    const data = await response.json();

    return new Volunteer(data.username, data.firstName, data.lastName, data.phoneNumber, data.isValidated, data.localUnitId);
}
