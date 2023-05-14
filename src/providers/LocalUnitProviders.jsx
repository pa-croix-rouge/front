import LocalUnitContext from "../contexts/LocalUnitContext";
import React, {useState} from "react";

const LocalUnitProviders = ({ children }) => {
    const [localUnit, setLocalUnit] = useState('');

    return (
        <LocalUnitContext.Provider value={{ localUnit, setLocalUnit }}>
            {children}
        </LocalUnitContext.Provider>
    );
};

export default LocalUnitProviders;
