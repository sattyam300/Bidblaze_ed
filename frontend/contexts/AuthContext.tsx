
import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  full_name: string
  role: 'buyer' | 'seller' | 'admin'
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' // Include cookies for authentication
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User authenticated:', userData);
        setUser(userData.user);
      } else {
        console.log('User not authenticated, status:', response.status);
        // 401 is expected for unauthenticated users, so we don't need to log it as an error
        if (response.status !== 401) {
          console.error('Authentication check failed with status:', response.status);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role = 'buyer') => {
    try {
      console.log('Signing up user:', { email, fullName, role });
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign up successful:', data);
        setUser(data.user);
        return { error: null };
      } else {
        console.error('Sign up failed:', data);
        return { error: { message: data.message } };
      }
    } catch (error) {
      console.error('Sign up network error:', error);
      return { error: { message: 'Network error occurred' } };
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', { email });
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign in successful:', data);
        setUser(data.user);
        return { error: null };
      } else {
        console.error('Sign in failed:', data);
        return { error: { message: data.message } };
      }
    } catch (error) {
      console.error('Sign in network error:', error);
      return { error: { message: 'Network error occurred' } };
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await fetch('http://localhost:8080/api/auth/logout', { 
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setUser(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
