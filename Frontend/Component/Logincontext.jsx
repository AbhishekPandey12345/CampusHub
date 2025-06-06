import { createContext, useState } from 'react';

// Create a context
export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [islogin, setIslogin] = useState(false);

    return (
        <LoginContext.Provider value={{ islogin, setIslogin }}>
            {children}
        </LoginContext.Provider>
    );
};
