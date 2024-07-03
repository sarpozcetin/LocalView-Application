//Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express(); //Create express application
const port = 3000; //Define server port number

//Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#S8a4a8K5#',
    database: 'localview'
});

//Connect to MySQL
db.connect((err) => {
    if(err) {
        throw err; //MySQL connection failed
    }
    console.log('MySQL Connected........')
});

//Use body parser middleware to parse JSON request
app.use(bodyParser.json());
//Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

/**
 * 
 * @param {String} timestamp - Timestamp to be converted 
 * @returns {string} - MySQL formatted timestamp 'YYYY-MM-DD HH:MM:SS'
 */
function timestampConvert(timestamp) {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = (`0${dateObj.getMonth() + 1}`).slice(-2);
    const day = (`0${dateObj.getDate()}`).slice(-2);
    const hours = (`0${dateObj.getHours()}`).slice(-2);
    const minutes = (`0${dateObj.getMinutes()}`).slice(-2);
    const seconds = (`0${dateObj.getSeconds()}`).slice(-2);
    return `${year}-${month}=${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Handles POST requests to save user data
 * @param {Object} req - The request object containing the user data
 * @param {Object} res - The response object to send back 
 */
app.post('/saveUserData', (req, res) => {
    const {ip, timestamp, latitude, longitude, city, country } = req.body; //Destructure request
    console.log('Recieved Data:', req.body); //Recieved data
    const formatted_tm = timestampConvert(timestamp); //Convert timestamp to MySQL format
    const query = 'INSERT INTO userInfo (ip_address, timestamp, latitude, longitude, city, country) VALUES (?, ?, ?, ?, ?, ?)';

    //Execute SQL query to insert user data
    db.query(query, [ip, formatted_tm, latitude, longitude, city, country], (err, result) => {
        if (err) {
            console.error('Error inserting following data:', err); //Log errors
            res.status(500).send('Server Error');
        } else {
            console.log('User Data Saved.........'); //Success
            res.send('User Data successfully inserted');
        }
    });
});

//Start the server and listen on the port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); //Server successfully started
});