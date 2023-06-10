import {Token} from "../model/Token";
import {useContext} from "react";
import TokenContext from "../contexts/TokenContext";

const { API_URL } = require('env');

const readToken = (): string => {
    const {token}: Token = useContext(TokenContext) as unknown as Token;
    const localToken: Token = {token: localStorage.getItem('token')};
    if (token === undefined || token === null || token === '') {
        return localToken.token as string;
    }
    return token;
}

export const getWithToken = async (url: string): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readToken(),
        },
        redirect: 'follow',
    });
}

export const postWithoutToken = async (url: string, body: any): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}

export const postWithToken = async (url: string, body: any): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readToken(),
        },
        body: JSON.stringify(body),
    });
}

export const deleteWithToken = async (url: string): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readToken(),
        },
    });
}
