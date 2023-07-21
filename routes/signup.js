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
    .post("/", (req, res) => {
        const userId = req.body.userId;
        const userPw = req.body.userPw;
        const userName = req.body.userName;
        console.log(userId + " " + userPw + " " + userName);
        connection.query("INSERT INTO userTable (userId, userPw, userName) VALUES(?, ?, ?)", 
        [userId, userPw, userName], function(error, rows){
            if(error) throw error;
            console.log("asdf");
            res.status(201).json({'result' : 'ok'});
        });
    })


module.exports = router;