import React, { useState } from "react";
import VolunteerContext from "contexts/VolunteerContext";

const VolunteerProvider = ({ children }) => {
    const [volunteer, setVolunteer] = useState('');

    return (
        <VolunteerContext.Provider value={{ volunteer, setVolunteer }}>
            {children}
        </VolunteerContext.Provider>
    );
};

export default VolunteerProvider;
