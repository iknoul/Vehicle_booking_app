// tokenManager.ts

export class TokenManager {
    private timeoutId: NodeJS.Timeout | null = null; // Instance variable to track the timeout
    private logoutFunction : Function | undefined = undefined;
    // Function to store JWT and set up expiry
    setToken(token: string, expiryTime: number, logout: Function) {
        // Clear any existing timeout to prevent premature session clearing
        this.clearTimeout();

        // Get the current time and calculate when the token expires
        const currentTime: number = Date.now() / 1000; // Current time in seconds

        // Store the token in session storage
        sessionStorage.setItem('token', token);

        // Calculate the delay until the token expires in milliseconds
        const timeoutDelay: number = (expiryTime - currentTime) * 1000;

        // Set a timeout to clear session storage when the token expires
        this.timeoutId = setTimeout(() => {
            sessionStorage.clear(); // Clear session storage
            console.log('Session storage cleared: JWT token has expired');
            // Optionally, redirect to login page or show a message
            // window.location.href = '/login'; 
        }, timeoutDelay);

        // Set logout for when session expires
        this.logoutFunction = logout
    }

    // Clear the timeout
    clearTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    logout () {
        if(this.logoutFunction){
            this.logoutFunction()
        }
        this.logoutFunction = undefined;
    }
    // Function to log out the user
    clearToken() {
        // Clear the session storage
        sessionStorage.clear();
        // logout when session expires
        this.logout()
        // Clear any existing timeout
        this.clearTimeout();
        
        console.log('User logged out and session storage cleared');
    }
}
