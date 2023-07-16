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
    .get("/get-book-entity", (req, res) => {
        console.log("GET BOOK ENTITY");
        const bookNo = req.query.bookNo;
        connection.query('SELECT * FROM bookTable WHERE bookNo = ?', [bookNo], function (error, rows){
            if(error)   throw error;
            if(rows.length==1){
                res.status(200).json(rows[0]);
            }else{
                res.status(401);
            }
        })
    })
    .get("/get-group-book-no", (req, res) => {
        console.log("GET GROUP BOOK NO");
        const groupNo = req.query.groupNo;
        connection.query('SELECT groupBookNo FROM groupTable WHERE groupNo = ?', [groupNo], function (error, rows){
            if(error) throw error;
            if(rows.length == 1){
                res.status(200).json(rows);
            }else{
                res.status(401);
            }
        })
    })
    .get("/get-reading-book-no-list", (req, res) => {
        console.log("GET READING BOOK LIST");
        const userNo = req.query.userNo;
        connection.query('SELECT bookNo FROM userBookTable WHERE userNo = ? AND bookType = \'Reading\'', [userNo], function(error, rows){
            if(error) throw error;
            res.status(200).json(rows);
        })
    })
    .get("/get-will-read-book-no-list", (req, res) => {
        console.log("GET WILL READ BOOK LIST");
        const userNo = req.query.userNo;
        connection.query('SELECT bookNo FROM userBookTable WHERE userNo = ? AND bookType = \'WillRead\'', [userNo], function(error, rows){
            if(error) throw error;
            res.status(200).json(rows);
        })
    })




module.exports = router;