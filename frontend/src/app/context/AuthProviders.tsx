'use client'
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { decodeToken } from '@/app/utils/decodeToken';
import { TokenManager } from '../utils/tokenManager'; // Adjust the import path as necessary

const sessionManager = new TokenManager();

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// temporary always true for login
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [role, setRole] = useState<string>('admin');
	const [userId, setUserId] = useState<string | undefined>(undefined);
	const [token, setToken] = useState<string | undefined>('')

 	 // Handler to Log out
  	const handleLogOut = async () => {
		setUserId(undefined); // Optional: clear user on logout
		setRole('')
		setToken(undefined)
		setIsAuthenticated(false);
	};
  	const login = (token: string) => {
		const user = decodeToken(token)
		if(user){
			setToken(token)
			setUserId(user.id)
			// setRole(user?.role)
			const expiryTime = user.exp; // Extract the expiry time
			// Set the token and its expiry
			sessionManager.setToken(token, expiryTime, handleLogOut);
			setIsAuthenticated(true)
		}
	};
	const logout = () => {		
		sessionManager.clearToken();
	};
	 // Automatically check for token on mount
	 useEffect(() => {
		const storedToken = sessionStorage.getItem('token');
		if (storedToken) {
		  	login(storedToken);
		}
	  }, [isAuthenticated]);

	return (
		// Assuming the context setup is similar to this:
		<AuthContext.Provider
			value={useMemo(() => ({
				isAuthenticated,
				role,
				userId,
				token,
				login,
				logout,
				setRole,
				setUserId,
				setToken
			}), [isAuthenticated, role, userId, token, login, logout, setRole, setUserId, setToken])}
		>
			{children}
		</AuthContext.Provider>
	);
};
export default AuthProvider;
