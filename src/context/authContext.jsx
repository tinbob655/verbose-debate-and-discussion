import React, {createContext, useContext, useState} from 'react';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [auth, setAuth] = useState(null);

    const updateAuth = (newAuth) => {
        setAuth(newAuth);
    };

    return <AuthContext.Provider value={{auth, updateAuth}}>
        {children}
    </AuthContext.Provider>
};

const useAuth = () => {
    return useContext(AuthContext);
};

export {AuthContextProvider, useAuth};