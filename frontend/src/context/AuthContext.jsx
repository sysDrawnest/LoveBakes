import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('lovebakes_user');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    const login = async (email, password) => {
        const { data } = await loginApi({ email, password });
        setUser(data);
        localStorage.setItem('lovebakes_user', JSON.stringify(data));
        return data;
    };

    const register = async (name, email, password, phone) => {
        const { data } = await registerApi({ name, email, password, phone });
        setUser(data);
        localStorage.setItem('lovebakes_user', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lovebakes_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
