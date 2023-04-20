import { User } from "../model/User";
import { Token } from "../model/Token";

const API_URL = process.env.API_URL;

export const login = async (user: User): Promise<Token> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
        token: data.token,
    };
};
