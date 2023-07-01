import LocalUnitContext from "../contexts/LocalUnitContext";
import React, {useState} from "react";
import {LocalUnit} from "../model/LocalUnit";

const LocalUnitProviders = ({ children }) => {
    const [localUnit, setLocalUnit] = useState(new LocalUnit(undefined, '', undefined, '', ''));

    return (
        <LocalUnitContext.Provider value={{ localUnit, setLocalUnit }}>
            {children}
        </LocalUnitContext.Provider>
    );
};

export default LocalUnitProviders;
