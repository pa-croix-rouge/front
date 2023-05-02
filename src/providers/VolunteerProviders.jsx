import VolunteerProvider from "contexts/VolunteerContext";
import React, { useState } from "react";

const VolunteerProvider = ({ children }) => {
    const [volunteer, setVolunteer] = useState('');

    return (
        <VolunteerProvider.Provider value={{ volunteer, setVolunteer }}>
            {children}
        </VolunteerProvider.Provider>
    );
};

export default VolunteerProvider;
