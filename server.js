const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#S8a4a8K5#',
    database: 'localview'
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySQL Connected........')
});

app.use(bodyParser.json());

app.post('/saveUserData', (req, res) => {
    const {ip, timestamp, latitude, longitude, city, country } = req.body;
    const query = 'INSERT INTO userInfo (ip_address, timestamp, latitude, longitude, city, country) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [ip, timestamp, latitude, longitude, city, country], (err, result) => {
        if (err) {
            console.error('Error inserting following data:', err);
            res.status(500).send('Server Error');
        } else {
            res.send('User Data successfully inserted');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});