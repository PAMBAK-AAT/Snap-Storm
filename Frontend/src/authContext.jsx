// Importing necessary React hooks and utilities
import React, { createContext, useState, useEffect, useContext } from 'react';

// Creating the AuthContext which will hold the authentication data
const AuthContext = createContext();

// Custom hook to use AuthContext easily in any component
export const useAuth = () => {
    return useContext(AuthContext); // This provides access to currentUser and setCurrentUser
}

// AuthProvider component to wrap around components that need authentication access
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // State to store current user's ID

    useEffect(() => {
        // On component mount, check if user ID is saved in localStorage
        const userId = localStorage.getItem('userId');
        if (userId) {
            // If found, set it as the current user
            setCurrentUser(userId);
        }
    }, []); // Empty dependency array ensures this runs only once (on mount)

    // Object containing the state and setter, will be provided to context consumers
    const value = {
        currentUser,
        setCurrentUser
    };

    // Provide the authentication context to all child components
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
