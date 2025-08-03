-- This SQL file sets up the necessary tables in your PostgreSQL database.

-- Create a table for patients
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for doctors
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    experience INT,
    location VARCHAR(100),
    clinic_name VARCHAR(100),
    bio TEXT,
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    doctor_id INT REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- e.g., 'scheduled', 'completed', 'cancelled'
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(doctor_id, appointment_date, appointment_time) -- Prevent double booking
);

-- Insert some sample doctor data for testing
INSERT INTO doctors (name, email, password, specialization, experience, location, clinic_name, bio, profile_picture_url) VALUES
('Dr. Emily Carter', 'emily.carter@clinic.com', '$2a$10$your_hashed_password_here', 'Cardiologist', 12, 'Metropolis', 'Metro Cardiac Care', 'Dr. Carter is a board-certified cardiologist with over a decade of experience in treating heart conditions.', 'https://placehold.co/100x100/EFEFEF/333?text=EC'),
('Dr. Ben Adams', 'ben.adams@clinic.com', '$2a$10$your_hashed_password_here', 'Dermatologist', 8, 'Star City', 'Star Skin Clinic', 'Specializing in cosmetic and medical dermatology, Dr. Adams is dedicated to healthy skin for all ages.', 'https://placehold.co/100x100/EFEFEF/333?text=BA'),
('Dr. Sarah Lee', 'sarah.lee@clinic.com', '$2a$10$your_hashed_password_here', 'Pediatrician', 15, 'Metropolis', 'Child Health Associates', 'A compassionate pediatrician focused on providing comprehensive care for children from infancy through adolescence.', 'https://placehold.co/100x100/EFEFEF/333?text=SL');
