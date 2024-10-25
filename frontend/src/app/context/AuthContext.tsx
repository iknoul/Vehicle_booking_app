'use client'
import { createContext,} from 'react';



// Define the AuthContext type
interface AuthContextType 
{
  isAuthenticated: boolean;
  role: string;
  login: Function;
  logout: Function;
  setRole: Function;
  userId?: string;
  setUserId: Function;
  token?: string;
  setToken: Function;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);



