import React, {createContext, useContext, useState, useEffect} from 'react';

const IsMobileContext = createContext();

const IsMobileContextProvider = ({children}) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= window.innerHeight ? true : false);

    window.onresize = () => {
        setIsMobile(window.innerWidth <= window.innerHeight? true : false);
    };

    useEffect(() => {
        if (isMobile) {
            import('../mobileStyles.scss');
            sessionStorage.setItem('wasMobile', 'true');
        }
        else if (sessionStorage.getItem('wasMobile') == 'true') {
            sessionStorage.removeItem('wasMobile');
            window.location.reload();
        };
    }, [isMobile]);

    return <IsMobileContext.Provider value={{isMobile}} >
        {children}
    </IsMobileContext.Provider>
};

const useIsMobile = () => {
    return useContext(IsMobileContext);
};

export {IsMobileContextProvider, useIsMobile};