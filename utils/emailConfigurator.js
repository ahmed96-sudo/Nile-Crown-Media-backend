const nodemailer = require('nodemailer');
require('dotenv').config();

/* const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // STARTTLS is used, not SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // see below
    },
    tls: {
        ciphers: 'SSLv3',
    },
}); */
const transporter = nodemailer.createTransport({
    service: 'gmail', // or "smtp.zoho.com", "mailgun", etc.
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Use an app-specific password for Gmail!
    },
});


module.exports = transporter;