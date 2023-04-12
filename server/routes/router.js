const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '/../../frontend/index.html'));
    } catch (error) {
        console.error('\x1b[31mERROR: \x1b[37mFailed to send file:', error.message);
        res.status(500).send('Internal Server Error');
        process.exit(1);
    }
});

module.exports = router;
