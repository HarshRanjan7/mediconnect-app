// File Path: backend/createPatient.js

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// This script will create a new patient with a correctly hashed password.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createNewPatient() {
    console.log('Connecting to the database...');
    const client = await pool.connect();
    console.log('Connected successfully.');

    try {
        const name = 'Priya Singh';
        const email = 'priya.singh@example.com';
        const plainPassword = 'password123'; // The password you will use to log in

        console.log(`Hashing password for ${name}...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        console.log('Password hashed.');

        console.log(`Inserting new patient into the database...`);
        await client.query(
            `INSERT INTO patients (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, hashedPassword]
        );

        console.log('\nSUCCESS! A new patient has been created.');
        console.log('You can now log in on the website with these details:');
        console.log(`------------------------------------`);
        console.log(`Email:    ${email}`);
        console.log(`Password: ${plainPassword}`);
        console.log(`------------------------------------`);

    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            console.error('\nERROR: A patient with this email already exists.');
        } else {
            console.error('\nAn error occurred:', error);
        }
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

createNewPatient();