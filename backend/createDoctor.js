// File Path: backend/createDoctor.js

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// This script will create a new doctor with a correctly hashed password.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createNewDoctor() {
    console.log('Connecting to the database...');
    const client = await pool.connect();
    console.log('Connected successfully.');

    try {
        const name = 'Dr. Kumar Verma';
        const email = 'kumar.verma@clinic.com';
        const plainPassword = 'password123'; // The password you will use to log in

        console.log(`Hashing password for ${name}...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        console.log('Password hashed.');

        console.log(`Inserting new doctor into the database...`);
        await client.query(
            `INSERT INTO doctors (name, email, password, specialization, experience, location, clinic_name, bio, profile_picture_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                name,
                email,
                hashedPassword,
                'General Physician',
                15,
                'Delhi',
                'Community Clinic',
                'Dr. Verma is a trusted general physician with over 15 years of experience.',
                'https://placehold.co/100x100/65A30D/FFFFFF?text=KV'
            ]
        );

        console.log('\nSUCCESS! A new doctor has been created.');
        console.log('You can now log in on the website with these details:');
        console.log(`------------------------------------`);
        console.log(`Email:    ${email}`);
        console.log(`Password: ${plainPassword}`);
        console.log(`------------------------------------`);

    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            console.error('\nERROR: A doctor with this email already exists in the database.');
        } else {
            console.error('\nAn error occurred:', error);
        }
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

createNewDoctor();