import {jwtDecode} from 'jwt-decode';

type TokenPayload = {
	id:string;
	stage:string;
	role:string;
	exp: number;
	// Add other fields as needed
};

export const decodeToken = (token: string): TokenPayload | null => {
	try {
		return jwtDecode<TokenPayload>(token);
	} catch (error) {
		return null;
	}
};
