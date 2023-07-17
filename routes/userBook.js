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
        //console.log(userNo);
        //console.log(bookNo);
        connection.query('SELECT * FROM userBookTable WHERE userNo = ? AND bookNo = ?', [userNo, bookNo], function (error, rows){
            if(rows.length==1) res.status(200).json(rows[0]);
            else res.status(401);
        });
    })

    .post("/update-user-book-entity", (req, res) => {
        console.log("UPDATE USER BOOK ENTITY");
        const userNo = req.body.userNo;
        const bookNo = req.body.bookNo;
        const userPage = req.body.userPage;
        const userTime = req.body.userTime;
        const bookType = req.body.bookType;
        connection.query("UPDATE userBookTable SET userPage = ?, userTime = ?, bookType = ? WHERE userNo = ? AND bookNo = ?", [userPage, userTime, bookType, userNo, bookNo], function(error, rows){
            if(error){
                throw error;
            }else{
                return res.status(200).json(rows);
            }
        })
    })




module.exports = router;