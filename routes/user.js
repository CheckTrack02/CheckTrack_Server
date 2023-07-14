const express = require("express");
const router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'checktrack'
});
connection.connect();

router
    .get("/user_list", (req, res) => {
        
    })
    .post("/login", (req, res) => {
        
    })
    .post("/insert", (req, res) => {
        
    });


module.exports = router;