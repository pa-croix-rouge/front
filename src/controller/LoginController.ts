import { User } from "../model/User";
import { Token } from "../model/Token";
import {postWithoutToken} from "./Controller";

export const login = async (user: User): Promise<Token> => {
    const response = await postWithoutToken(`login/volunteer`, user);

    if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
        token: data.jwtToken,
    };
};
