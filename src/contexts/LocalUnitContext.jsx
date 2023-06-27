import {createContext} from "react";

const LocalUnitContext = createContext({
    localUnits: undefined,
    setLocalUnits: () => {},
});
export default LocalUnitContext;
