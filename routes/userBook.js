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
    .get("/get-user-book-entity", (req, res) => {
        console.log("GET USER BOOK ENTITY");
        const userNo = req.query.userNo;
        const bookNo = req.query.bookNo;
        connection.query('SELECT * FROM userBookTable WHERE userNo = ? AND bookNo = ?', [userNo, bookNo], function (error, rows){
            if(rows.length==1) res.status(200).json(rows);
            else res.status(401);
        });
    })




module.exports = router;