import {createContext} from "react";

const ProductLimitsContext = createContext({
    productLimits: [],
    setProductLimits: () => {
    },
});

export default ProductLimitsContext;