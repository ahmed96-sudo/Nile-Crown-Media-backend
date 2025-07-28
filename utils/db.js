const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // required by Neon
    },
});

module.exports = pool;
