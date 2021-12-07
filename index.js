const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require('cors');
const {encrypt, decrypt} = require('./Encryption');

/** create a connection to mySQL workbench */
const passwordsConnect = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Hello22World!",
    database: "PasswordsDB",
});

app.use(cors()); // lightens security restrictions
app.use(express.json()); // views objects as JSON
app.use(bodyParser.urlencoded({extended: true})); // parses the data


/** when function is called, it reveils the website, email, and encrypted password */
app.get("/app/homepage" , (req, res) => {
    const sqlShowPasswords = "SELECT * FROM passwords"; 
    passwordsConnect.query(sqlShowPasswords, (err, result)=> {
        res.send(result); // sends the result to the front end
    });
})

/** when function is called, it stores the values that need to be inputted in the db */
app.post("/app/add", (req, res) => {
    const website = req.body.website; // stores the inputted website
    const email = req.body.email; // stores the inputted email
    const password = req.body.password; // stores the inputted password

    const hashedPassword = encrypt(password); // password is hashed by calling the encrypt function

    const sqlAdd = "INSERT INTO passwords (website, email, password, iv) VALUES (?, ?, ?, ?)"
    passwordsConnect.query(sqlAdd, [website, email, hashedPassword.password, hashedPassword.iv], (err, result)=> { // addeds the website, email, password, and iv in the db
        console.log(err); 
    });
});

/** when function is called, it deletes the row based on the id of the row */
app.delete('/app/delete/:id', (req, res) => {
    const id = req.params.id; // stores the id 
    const sqlDelete = "DELETE FROM passwords WHERE `id` = ?";

    passwordsConnect.query(sqlDelete, id, (err, result) => { 
        if (err) {
             console.log(err); // log error if error occurs
        }
        else
            console.log(result);
    });
});

/** when function is called, it sends the information to decrypt and sends it back to the front end */
app.post('/app/decryptpassword', (req, res) => {
    res.send(decrypt(req.body));
})

// server set up
app.listen(3001, () => {
    console.log('Server is running');
});