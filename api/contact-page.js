const { validationResult } = require('express-validator');
const contactPageValidationResult = require('../middlewares/ValidationResults').contactPageValidationResult;
const transporter = require('../utils/emailConfigurator');
const CORShandler = require('../middlewares/CORShandler');


module.exports = async (req, res) => {
    CORShandler(req, res);
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

    for (const validator of contactPageValidationResult) {
        await validator.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fname, lname, email, phone, service, budget, message } = req.body;
    // const recipientEmail = "hello@nilecrownmedia.com"
    const recipientEmail = "ahmed.saeed.12855@gmail.com"

    const mailOptions = {
        from: recipientEmail,
        to: recipientEmail,
        subject: "New Submission from the website",
        html: `
            <p>Someone just submitted the Contact page form on your website.</p>
            <p>Here's what they had to say:</p>
            <p><strong>Full Name:</strong> ${fname + ' ' + lname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <p><strong>Message:</strong><br/>${message}</p>
    `,
        replyTo: email,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};
