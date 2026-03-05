import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Replace with your actual credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if credentials are provided, otherwise use mock
const hasValidCredentials = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key';

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidCredentials;

// Database types
export interface DatabaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  license_number?: string;
  license_state?: string;
  license_expiry?: string;
  license_verified: boolean;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}

export interface DatabaseVehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  category: string;
  year: number;
  seats: number;
  transmission: string;
  mpg: number;
  price_per_day: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  turo_url: string;
  turo_id: string;
  rating: number;
  trip_count: number;
  is_available: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBooking {
  id: string;
  user_id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

// Auth functions - return mock data if Supabase is not configured
export async function signUp(email: string, password: string, userData: {
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
}) {
  if (!isSupabaseConfigured) {
    console.log('Mock signup:', email, userData);
    return { 
      data: { 
        user: { 
          id: 'mock-' + Date.now(), 
          email,
          user_metadata: userData 
        } 
      }, 
      error: null 
    };
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        license_number: userData.licenseNumber,
        license_state: userData.licenseState,
        license_expiry: userData.licenseExpiry,
        date_of_birth: userData.dateOfBirth,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
      },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured) {
    console.log('Mock signin:', email);
    return { 
      data: { 
        user: { 
          id: 'mock-user', 
          email 
        } 
      }, 
      error: null 
    };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    return { user: null, error: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured) {
    return { 
      data: { 
        id: userId,
        first_name: 'Demo',
        last_name: 'User',
        phone: '',
        license_verified: false,
        is_admin: false,
      }, 
      error: null 
    };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateUserProfile(userId: string, updates: Partial<DatabaseUser>) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
}

// Vehicle functions
export async function getAllVehicles() {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('name');
  return { data, error };
}

export async function getVisibleVehicles() {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_hidden', false)
    .order('name');
  return { data, error };
}

export async function getVehicleById(id: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

export async function createVehicle(vehicle: Omit<DatabaseVehicle, 'id' | 'created_at' | 'updated_at'>) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('vehicles')
    .insert([vehicle])
    .select()
    .single();
  return { data, error };
}

export async function updateVehicle(id: string, updates: Partial<DatabaseVehicle>) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('vehicles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteVehicle(id: string) {
  if (!isSupabaseConfigured) {
    return { error: null };
  }
  
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);
  return { error };
}

export async function toggleVehicleVisibility(id: string, isHidden: boolean) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('vehicles')
    .update({ is_hidden: isHidden, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Booking functions
export async function createBooking(booking: Omit<DatabaseBooking, 'id' | 'created_at' | 'updated_at'>) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single();
  return { data, error };
}

export async function getUserBookings(userId: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, vehicles(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getAllBookings() {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, vehicles(*), profiles(*)')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function updateBookingStatus(id: string, status: DatabaseBooking['status']) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// License verification
export async function submitLicenseVerification(userId: string, licenseData: {
  license_number: string;
  license_state: string;
  license_expiry: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...licenseData,
      license_verified: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

export async function verifyLicense(userId: string, verified: boolean) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      license_verified: verified,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

// Admin check
export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  return data.is_admin === true;
}

// Storage functions for images
export async function uploadVehicleImage(file: File, vehicleId: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${vehicleId}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('vehicle-images')
    .upload(fileName, file);
  
  if (error) return { data: null, error };
  
  const { data: { publicUrl } } = supabase.storage
    .from('vehicle-images')
    .getPublicUrl(fileName);
  
  return { data: publicUrl, error: null };
}
