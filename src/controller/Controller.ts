import {Token} from "../model/Token";
import {useContext} from "react";
import TokenContext from "../contexts/TokenContext";

const { API_URL } = require('env');

export const getWithToken = async (url: string): Promise<Response> => {
    const {token}: Token = useContext(TokenContext) as unknown as Token;

    return fetch(`${API_URL}/${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        redirect: 'follow',
    });
}
