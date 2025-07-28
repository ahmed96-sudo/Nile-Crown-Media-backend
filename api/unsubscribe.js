const { validationResult } = require('express-validator');
const unsubscribeEmailValidationResult = require('../middlewares/ValidationResults').unsubscribeEmailValidationResult;
const pool = require('../utils/db');
const CORShandler = require('../middlewares/CORShandler');

module.exports = async (req, res) => {
    CORShandler(req, res);

    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

    for (const validator of unsubscribeEmailValidationResult) {
        await validator.run(req);
    }

    const errors = validationResult(req);
    // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    if (!errors.isEmpty()) {
        return res.status(400).send(`<h2 style="text-align:center;">${errors.array()[0].msg}.</h2>`);
    }

    const email = req.query.email;
    // const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');
    if (!email) return res.status(400).send(`<h2 style="text-align:center;">Invalid request: email not provided.</h2>`);
    // if (!email || !email.includes('@')) {
    //     return res.status(400).send('<h2>Invalid or missing email.</h2>');
    // }

    try {
        const result = await pool.query('DELETE FROM subscribers WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            return res.status(404).send(`<h2 style="text-align:center;">Invalid Request: Email not found or already unsubscribed.</h2>`);
        }

        return res.status(200).send(`
            <html>
                <head><title>Unsubscribed</title></head>
                <body>
                <h2 style="text-align:center;">You have been unsubscribed successfully.</h2>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error unsubscribing:', error);
        return res.status(500).send(`<h2 style="text-align:center;">Error Deleting from database.</h2>`);
    }


    // let subscribers = [];

    // try {
    //     const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    //     subscribers = JSON.parse(data || '[]');
    // } catch (err) {
    //     console.error('Error reading subscribers file:', err);
    //     return res.status(500).send(`<h2 style="text-align:center;">Server error. Please try again later.</h2>`);
    // }

    // const newSubscribers = subscribers.filter(sub => sub !== email);

    // if (newSubscribers.length === subscribers.length) {
    //     return res.status(404).send(`<h2 style="text-align:center;">Invalid Request: Email not found.</h2>`);
    // }

    // try {
    //     fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(newSubscribers, null, 2));
    //     return res.status(200).send(`<h2 style="text-align:center;">You have been successfully unsubscribed.</h2>`);
    // } catch (err) {
    //     console.error(err);
    //     return res.status(500).send(`<h2 style="text-align:center;">Error writing to file.</h2>`);
    // }
};
