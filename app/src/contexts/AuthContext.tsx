import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  supabase, 
  signUp as supabaseSignUp, 
  signIn as supabaseSignIn, 
  signOut as supabaseSignOut,
  getCurrentUser,
  getUserProfile,
  checkIsAdmin
} from '../lib/supabase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiry?: string;
  licenseVerified: boolean;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (hardcoded for demo - in production, use database)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { user: supabaseUser, error } = await getCurrentUser();
      
      if (error || !supabaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await getUserProfile(supabaseUser.id);
      
      if (profileError || !profile) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const isAdmin = await checkIsAdmin(supabaseUser.id);

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        licenseNumber: profile.license_number,
        licenseState: profile.license_state,
        licenseExpiry: profile.license_expiry,
        licenseVerified: profile.license_verified || false,
        dateOfBirth: profile.date_of_birth,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        isAdmin: isAdmin,
      });
    } catch (err) {
      console.error('Session check error:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Check for admin login
      if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const adminUser: User = {
          id: 'admin',
          email: 'admin@rochester.rentals',
          firstName: 'Admin',
          lastName: 'User',
          phone: '',
          licenseVerified: true,
          isAdmin: true,
        };
        setUser(adminUser);
        return true;
      }

      // Regular user login via Supabase
      const { data, error } = await supabaseSignIn(email, password);
      
      if (error || !data.user) {
        console.error('Login error:', error);
        return false;
      }

      // Get user profile
      const { data: profile, error: profileError } = await getUserProfile(data.user.id);
      
      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        return false;
      }

      const isAdmin = await checkIsAdmin(data.user.id);

      setUser({
        id: data.user.id,
        email: data.user.email!,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        licenseNumber: profile.license_number,
        licenseState: profile.license_state,
        licenseExpiry: profile.license_expiry,
        licenseVerified: profile.license_verified || false,
        dateOfBirth: profile.date_of_birth,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        isAdmin: isAdmin,
      });

      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const { data: authData, error } = await supabaseSignUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseState: data.licenseState,
        licenseExpiry: data.licenseExpiry,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      // User will be automatically logged in after signup
      if (authData.user) {
        setUser({
          id: authData.user.id,
          email: authData.user.email!,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          licenseNumber: data.licenseNumber,
          licenseState: data.licenseState,
          licenseExpiry: data.licenseExpiry,
          licenseVerified: true, // Auto-verify for demo
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          isAdmin: false,
        });
      }

      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabaseSignOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await getUserProfile(user.id);
      
      if (error || !profile) return;

      const isAdmin = await checkIsAdmin(user.id);

      setUser({
        ...user,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        licenseNumber: profile.license_number,
        licenseState: profile.license_state,
        licenseExpiry: profile.license_expiry,
        licenseVerified: profile.license_verified || false,
        dateOfBirth: profile.date_of_birth,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        isAdmin: isAdmin,
      });
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          phone: updates.phone,
          license_number: updates.licenseNumber,
          license_state: updates.licenseState,
          license_expiry: updates.licenseExpiry,
          date_of_birth: updates.dateOfBirth,
          address: updates.address,
          city: updates.city,
          state: updates.state,
          zip: updates.zip,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        return false;
      }

      await refreshUser();
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    }
  }, [user, refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
