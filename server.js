const express = require('express');
const path = require('path');

const app = express();

/* Mount assets */
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

/* Listening */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Listening on port %d', PORT);
});
