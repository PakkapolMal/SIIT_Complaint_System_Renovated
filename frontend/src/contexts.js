import { createContext } from 'react';

/** @deprecated Import useAuth from contexts/AuthProvider.js instead */
export const AuthContext = createContext(null);

export const NavigationContext = createContext(null);

export { AuthProvider, useAuth } from './contexts/AuthProvider';
