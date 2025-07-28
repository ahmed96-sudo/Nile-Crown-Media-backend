const { validationResult } = require('express-validator');
const subscribeEmailValidationResult = require('../middlewares/ValidationResults').subscribeEmailValidationResult;
const transporter = require('../utils/emailConfigurator');
const pool = require('../utils/db');
const CORShandler = require('../middlewares/CORShandler');

module.exports = async (req, res) => {
    CORShandler(req, res);

    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    for (const validator of subscribeEmailValidationResult) {
        await validator.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    // const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');
    // const recipientEmail = "hello@nilecrownmedia.com"
    const recipientEmail = "ahmed.saeed.12855@gmail.com"
    // if (!email || typeof email !== 'string' || !email.includes('@')) {
    //     return res.status(400).json({ message: 'Invalid email' });
    // }

    // let subscribers = [];
    // if (fs.existsSync(SUBSCRIBERS_FILE)) {
    //     subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
    // }

    // if (subscribers.includes(email)) {
    //     return res.status(409).json({ success: false, message: 'Already subscribed' });
    // }

    // subscribers.push(email);
    // fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));

    try {
        await pool.query(
            'INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
            [email]
        );
        // return res.status(200).json({ message: 'Subscribed successfully.' });
    } catch (error) {
        console.error('Error subscribing:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }


    var base_url = req.protocol + '://' + req.get('host');

    const mailOptions = {
        from: recipientEmail,
        to: email,
        subject: 'Thanks for Subscribing!',
        html: `
            <p>Hello,</p>
            <p><strong>Thank you for subscribing to our newsletter! You'll receive updates soon.</strong></p>
            <p>If you have any questions, feel free to <a href="https://nilecrownmedia.com/contact">contact us</a>.</p>
            <p>Best regards,</p>
            <p><a href="https://nilecrownmedia.com">Nile Crown Media</a></p>
            <p>If you no longer wish to receive these emails, you can <a href="${base_url}/api/unsubscribe.js?email=${email}">unsubscribe here</a>.</p>
        `,
        replyTo: recipientEmail,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};
