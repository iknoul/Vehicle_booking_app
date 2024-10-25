'use client'
import { createContext,} from 'react';



// Define the AuthContext type
interface PageLoadingContextType 
{
 isPageLoading: boolean;
 setIsPageLoading: Function;
 setLoad: Function;
 removeLoad: Function;
 triggerTransition: Function;
}

// Create the AuthContext
export const PageLoadingContext = createContext<PageLoadingContextType | undefined>(undefined);



