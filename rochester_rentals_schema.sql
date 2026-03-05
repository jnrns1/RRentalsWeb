-- ============================================
-- ROCHESTER RENTALS DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    images TEXT[] DEFAULT '{}',
    description TEXT,
    specs JSONB DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'luxury',
    is_available BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    turo_url TEXT,
    location TEXT DEFAULT 'Rochester, MI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on vehicles
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to visible vehicles
CREATE POLICY "Allow public read access to visible vehicles" 
    ON vehicles FOR SELECT 
    USING (is_visible = true);

-- Allow authenticated users to read visible vehicles
CREATE POLICY "Authenticated users can read vehicles" 
    ON vehicles FOR SELECT 
    TO authenticated 
    USING (is_visible = true);

-- ============================================
-- 2. USERS TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    
    -- Driver's License Information
    license_number TEXT,
    license_state TEXT,
    license_expiry DATE,
    date_of_birth DATE,
    
    -- Address Information
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    
    -- Account Settings
    is_admin BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" 
    ON users FOR SELECT 
    TO authenticated 
    USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" 
    ON users FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id);

-- ============================================
-- 3. BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Booking Details
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_location TEXT DEFAULT 'Rochester, MI',
    delivery_address TEXT,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    
    -- Pricing
    daily_rate DECIMAL(10, 2) NOT NULL,
    total_days INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookings
CREATE POLICY "Users can read own bookings" 
    ON bookings FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

-- Users can create bookings
CREATE POLICY "Users can create bookings" 
    ON bookings FOR INSERT 
    TO authenticated 
    WITH CHECK (user_id = auth.uid());

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" 
    ON bookings FOR UPDATE 
    TO authenticated 
    USING (user_id = auth.uid());

-- ============================================
-- 4. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stripe Information
    stripe_payment_intent_id TEXT,
    stripe_customer_id TEXT,
    
    -- Payment Details
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending',
    
    -- Metadata
    payment_method TEXT,
    receipt_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own payments
CREATE POLICY "Users can read own payments" 
    ON payments FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

-- ============================================
-- 5. AVAILABILITY/BLACKOUT DATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicle_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT false,
    reason TEXT,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vehicle_id, date)
);

-- Enable RLS
ALTER TABLE vehicle_availability ENABLE ROW LEVEL SECURITY;

-- Public can read availability
CREATE POLICY "Public can read availability" 
    ON vehicle_availability FOR SELECT 
    USING (true);

-- ============================================
-- 6. ADMIN ACTIVITY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- INSERT SAMPLE VEHICLES (22 from your Turo fleet)
-- ============================================

INSERT INTO vehicles (make, model, year, price_per_day, images, description, specs, features, category, turo_url, is_available, is_visible) VALUES
('BMW', 'X5', 2023, 149.00, 
 ARRAY['https://images.unsplash.com/photo-1556189250-72ba95452bb4?w=800'],
 'Luxury SUV with premium interior and advanced technology features.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "23"}'::jsonb,
 ARRAY['Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Sunroof', 'Heated Seats'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Mercedes-Benz', 'C-Class', 2023, 129.00,
 ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
 'Elegant sedan with refined comfort and cutting-edge safety features.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "28"}'::jsonb,
 ARRAY['Leather Seats', 'Navigation', 'Apple CarPlay', 'Blind Spot Monitor', 'Sunroof'],
 'sedan', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Audi', 'Q7', 2023, 159.00,
 ARRAY['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800'],
 'Spacious luxury SUV perfect for families and group travel.',
 '{"seats": 7, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "21"}'::jsonb,
 ARRAY['Third Row Seating', 'Panoramic Roof', 'Virtual Cockpit', 'Premium Sound', 'Heated Seats'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Porsche', 'Cayenne', 2023, 199.00,
 ARRAY['https://images.unsplash.com/photo-1503376763036-066120622c74?w=800'],
 'Sporty luxury SUV that delivers exhilarating performance.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "19"}'::jsonb,
 ARRAY['Sport Package', 'Adaptive Air Suspension', 'Bose Audio', 'Sport Seats', 'Panoramic Roof'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Tesla', 'Model 3', 2023, 119.00,
 ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
 'All-electric sedan with autopilot and zero emissions.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Electric", "range": "358 miles"}'::jsonb,
 ARRAY['Autopilot', 'Full Self-Driving', 'Glass Roof', 'Premium Audio', 'Supercharging'],
 'sedan', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Range Rover', 'Sport', 2023, 229.00,
 ARRAY['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'],
 'Iconic British luxury SUV with commanding presence.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "20"}'::jsonb,
 ARRAY['Terrain Response', 'Meridian Audio', 'Panoramic Roof', 'Windsor Leather', 'Air Suspension'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('BMW', '7 Series', 2023, 249.00,
 ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
 'Flagship luxury sedan with executive rear seating.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "25"}'::jsonb,
 ARRAY['Executive Lounge Seating', 'Rear Entertainment', 'Massage Seats', 'Bowers & Wilkins Audio'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Mercedes-Benz', 'GLE', 2023, 179.00,
 ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'],
 'Premium midsize SUV with exceptional comfort and technology.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "22"}'::jsonb,
 ARRAY['MBUX System', 'Burmester Audio', 'Air Balance', 'Heated & Cooled Seats', '360 Camera'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Lexus', 'RX', 2023, 139.00,
 ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'],
 'Reliable luxury crossover with hybrid efficiency.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Hybrid", "mpg": "31"}'::jsonb,
 ARRAY['Mark Levinson Audio', 'Heads-Up Display', 'Safety System+', 'Heated Steering Wheel'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Cadillac', 'Escalade', 2023, 299.00,
 ARRAY['https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800'],
 'Full-size luxury SUV with unmatched presence and space.',
 '{"seats": 7, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "16"}'::jsonb,
 ARRAY['Super Cruise', 'AKG Studio Audio', 'OLED Display', 'Magnetic Ride Control', 'Massage Seats'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Audi', 'A6', 2023, 135.00,
 ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'],
 'Sophisticated executive sedan with Quattro all-wheel drive.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "27"}'::jsonb,
 ARRAY['Virtual Cockpit', 'MMI Touch', 'Bang & Olufsen', 'Matrix LED', 'Adaptive Cruise'],
 'sedan', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Genesis', 'GV80', 2023, 159.00,
 ARRAY['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'],
 'Korean luxury SUV with outstanding value and features.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "22"}'::jsonb,
 ARRAY['Lexicon Audio', 'Ergo Motion Seats', 'Highway Driving Assist', 'Mood Curator'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('BMW', 'X7', 2023, 219.00,
 ARRAY['https://images.unsplash.com/photo-1556800572-1b8aedf82c9e?w=800'],
 'Full-size luxury SUV with three rows of premium seating.',
 '{"seats": 7, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "21"}'::jsonb,
 ARRAY['Sky Lounge', 'Harman Kardon', 'Executive Package', 'Air Suspension', 'Soft Close Doors'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Mercedes-Benz', 'S-Class', 2023, 349.00,
 ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
 'The pinnacle of automotive luxury and innovation.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "24"}'::jsonb,
 ARRAY['MBUX Hyperscreen', 'E-Active Body Control', '4D Burmester', 'AR Head-Up Display', 'Chauffeur Package'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Tesla', 'Model Y', 2023, 129.00,
 ARRAY['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'],
 'Versatile electric SUV with impressive range and space.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Electric", "range": "330 miles"}'::jsonb,
 ARRAY['Autopilot', 'All-Glass Roof', 'Premium Audio', 'Supercharging', 'Camp Mode'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Porsche', 'Macan', 2023, 179.00,
 ARRAY['https://images.unsplash.com/photo-1503376763036-066120622c74?w=800'],
 'Compact luxury SUV with sports car DNA.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "21"}'::jsonb,
 ARRAY['Sport Chrono', 'PASM', 'BOSE Audio', 'Sport Design Package', 'Panoramic Roof'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Volvo', 'XC90', 2023, 149.00,
 ARRAY['https://images.unsplash.com/photo-1626668893632-6f3d4466d22f?w=800'],
 'Swedish luxury SUV focused on safety and Scandinavian design.',
 '{"seats": 7, "doors": 4, "transmission": "Automatic", "fuel": "Hybrid", "mpg": "55"}'::jsonb,
 ARRAY['Bowers & Wilkins', 'Pilot Assist', 'Orrefors Crystal', 'Air Suspension', 'Massage Seats'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Jaguar', 'F-PACE', 2023, 159.00,
 ARRAY['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'],
 'Sporty British SUV with dynamic handling.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "23"}'::jsonb,
 ARRAY['Meridian Audio', 'Adaptive Dynamics', 'Activity Key', 'Panoramic Roof', 'Windsor Leather'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Acura', 'MDX', 2023, 119.00,
 ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
 'Three-row luxury SUV with Type S performance.',
 '{"seats": 7, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "22"}'::jsonb,
 ARRAY['ELS Studio Audio', 'AcuraWatch', 'CabinTalk', 'Massage Seats', 'Panoramic Roof'],
 'suv', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Infiniti', 'QX80', 2023, 189.00,
 ARRAY['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'],
 'Full-size luxury SUV with powerful V8 performance.',
 '{"seats": 8, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "16"}'::jsonb,
 ARRAY['BOSE Audio', 'Hydraulic Suspension', 'Around View Monitor', 'Climate-Controlled Seats'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('Lincoln', 'Navigator', 2023, 259.00,
 ARRAY['https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800'],
 'American luxury SUV with massive presence and comfort.',
 '{"seats": 7, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", "mpg": "17"}'::jsonb,
 ARRAY['Revel Ultima Audio', 'Perfect Position Seats', 'Head-Up Display', 'Trailering Package'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true),

('BMW', 'iX', 2023, 189.00,
 ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'],
 'Revolutionary all-electric luxury SUV with futuristic design.',
 '{"seats": 5, "doors": 4, "transmission": "Automatic", "fuel": "Electric", "range": "324 miles"}'::jsonb,
 ARRAY['Shy Tech', 'Bowers & Wilkins Diamond', 'Air Suspension', 'Curved Display', 'Glass Controls'],
 'luxury', 'https://turo.com/gb/en/drivers/22192281/vehicles', true, true);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(is_available, is_visible);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_availability_vehicle_date ON vehicle_availability(vehicle_id, date);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);

-- ============================================
-- CREATE FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETED!
-- ============================================
SELECT 'Database schema created successfully!' AS status;
