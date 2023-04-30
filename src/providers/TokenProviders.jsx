import TokenContext from "contexts/TokenContext";
import React, { useState } from "react";

const TokenProvider = ({ children }) => {
    const [token, setToken] = useState('');

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
    );
};

export default TokenProvider;
