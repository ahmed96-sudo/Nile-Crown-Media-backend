const handleCors = (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://nile-crown-media.vercel.app');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    res.setHeader('Access-Control-Allow-Origin', 'https://nile-crown-media.vercel.app');
};

module.exports = handleCors;