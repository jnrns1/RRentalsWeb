# Supabase Setup Guide for Rochester Car Rental

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project name: "rochester-car-rental"
5. Choose region closest to your users (e.g., "US East (N. Virginia)")
6. Click "Create new project"

## 2. Get API Credentials

1. In your Supabase dashboard, go to Project Settings → API
2. Copy the following:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** API key

3. Create a `.env` file in your project root:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run SQL Setup

Go to SQL Editor in Supabase and run the following:

```sql
-- Enable Row Level Security
alter table auth.users enable row level security;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_number TEXT,
  license_state TEXT,
  license_expiry DATE,
  license_verified BOOLEAN DEFAULT FALSE,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sports', 'suv', 'luxury', 'economy', 'hybrid', 'electric')),
  year INTEGER NOT NULL,
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL DEFAULT 'Auto',
  mpg INTEGER,
  price_per_day INTEGER NOT NULL,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  turo_url TEXT NOT NULL,
  turo_id TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  trip_count INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_location TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle_availability table for calendar
CREATE TABLE IF NOT EXISTS public.vehicle_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  UNIQUE(vehicle_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_availability ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Vehicles policies
CREATE POLICY "Anyone can view visible vehicles" 
  ON public.vehicles FOR SELECT 
  USING (is_hidden = FALSE);

CREATE POLICY "Admin can view all vehicles" 
  ON public.vehicles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin can insert vehicles" 
  ON public.vehicles FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin can update vehicles" 
  ON public.vehicles FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin can delete vehicles" 
  ON public.vehicles FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Bookings policies
CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all bookings" 
  ON public.bookings FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample vehicles (replace with your actual fleet)
INSERT INTO public.vehicles (name, make, model, category, year, seats, transmission, mpg, price_per_day, image, description, features, turo_url, turo_id, rating, trip_count)
VALUES 
  ('Ford Mustang', 'Ford', 'Mustang', 'sports', 2022, 4, 'Auto', 24, 85, '/vehicles/ford-mustang-2022.jpg', 'Iconic American muscle car. Perfect for making a statement on your trip.', ARRAY['Bluetooth', 'Backup Camera', 'Apple CarPlay', 'Android Auto', 'Keyless Entry', 'Premium Sound'], 'https://turo.com/gb/en/car-rental/united-states/romulus-mi/ford/mustang/1999077', '1999077', 4.98, 67),
  ('Ford Expedition', 'Ford', 'Expedition', 'suv', 2022, 8, 'Auto', 19, 110, '/vehicles/ford-expedition-2022.jpg', 'Full-size SUV with plenty of room for the whole family and all your luggage.', ARRAY['3rd Row Seating', 'Tow Package', 'Navigation', 'Heated Seats', 'Power Liftgate', 'Bluetooth'], 'https://turo.com/gb/en/suv-rental/united-states/romulus-mi/ford/expedition/2160670', '2160670', 5.0, 81),
  ('Volkswagen Tiguan', 'Volkswagen', 'Tiguan', 'suv', 2024, 5, 'Auto', 26, 65, '/vehicles/vw-tiguan-2024.jpg', 'Compact SUV with German engineering. Great fuel economy and comfortable ride.', ARRAY['Apple CarPlay', 'Android Auto', 'Backup Camera', 'Bluetooth', 'Keyless Entry', 'Sunroof'], 'https://turo.com/gb/en/suv-rental/united-states/romulus-mi/volkswagen/tiguan/2716649', '2716649', 4.98, 65);

-- Create admin user (run this after creating a user through the app)
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'your-admin-email@example.com';
```

## 4. Set Up Storage for Vehicle Images

1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name: `vehicle-images`
4. Set to Public
5. Create bucket

## 5. Set Up Stripe Integration

1. Go to [https://stripe.com](https://stripe.com)
2. Create an account
3. Get your Publishable Key and Secret Key
4. Add to your `.env`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

## 6. Install Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## 7. Create Admin User

1. Sign up a user through the app
2. Run this SQL in Supabase SQL Editor:
```sql
UPDATE public.profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';
```

Or use the hardcoded admin login:
- Username: `admin`
- Password: `admin`

## 8. Deploy

Build and deploy your application:
```bash
npm run build
```

## Features Implemented

- ✅ User authentication (Sign up/Login)
- ✅ Admin dashboard with vehicle management
- ✅ Vehicle inventory with hide/show functionality
- ✅ Direct Turo links for each vehicle
- ✅ Calendar availability system
- ✅ Booking management
- ✅ Driver's license verification flow
- ✅ Stripe payment integration ready
- ✅ Row Level Security (RLS) for data protection
