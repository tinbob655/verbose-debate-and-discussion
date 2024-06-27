import React, {createContext, useContext, useState} from 'react';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [auth, setAuth] = useState(sessionStorage.getItem('auth') ? JSON.parse(sessionStorage.getItem('auth')) : null);

    const updateAuth = (newAuth) => {
        setAuth(newAuth);
        sessionStorage.setItem('auth', JSON.stringify(newAuth));
    };

    return <AuthContext.Provider value={{auth, updateAuth}}>
        {children}
    </AuthContext.Provider>
};

const useAuth = () => {
    return useContext(AuthContext);
};

export {AuthContextProvider, useAuth};