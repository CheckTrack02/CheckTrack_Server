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
    .get("/get-group-entity", (req, res) => {
        console.log("GET GROUP");
        const groupNo = req.query.groupNo;
        console.log(groupNo);
        connection.query('SELECT * FROM groupTable WHERE groupNo = ?', [groupNo], function (error, rows) {
            if(error) throw error;
            if(rows.length==1){
                res.status(200).json(rows[0]);
            }else{
                res.status(401);
            }
        });
    })
    .get("/get-user-group-no-list", (req, res) => {
        console.log("GET USER GROUP NO LIST");
        const userNo = req.query.userNo;
        connection.query('SELECT groupNo FROM groupUserTable WHERE userNo = ?', [userNo], function (error, rows){
            if(error) throw error;
            res.status(200).json(rows);
        });
    })
    .post("/post-group-entity", (req, res) => {
        console.log("POST GROUP");
        const groupName = req.body.groupName;
        const groupBookNo = req.body.groupBookNo;
        const [syear,smonth, sday] = req.body.groupStartDate.split('-');
        const groupStartDate = new Date(+syear, +smonth - 1, +sday);
        const [eyear,emonth, eday] = req.body.groupEndDate.split('-');
        const groupEndDate = new Date(+eyear, +emonth - 1, +eday);

        connection.query("INSERT INTO groupTable(groupName, groupBookNo, groupStartDate, groupEndDate) VALUES (?, ?, ?, ?)", 
        [groupName, groupBookNo, groupStartDate, groupEndDate], function(error, rows){
            if(error) throw error;
            console.log(rows.insertId);
            res.status(200).json({
                groupNo: rows.insertId,
            });
        });
    })
    .post("/post-group-user", (req, res) => {
        console.log("POST GROUP USER");
        const groupNo = req.body.groupNo;
        const groupBookNo = req.body.groupBookNo;
        const userNo = req.body.userNo;
        connection.query("INSERT INTO groupUserTable(groupNo, userNo, userPage, userTime) VALUES (?, ?, 0, 0)",
        [groupNo, userNo], function(error, rows){
            if(error) throw error;
            connection.query("SELECT * FROM userBookTable WHERE userNo = ? AND bookNo = ? ",
            [userNo, groupBookNo], function(error, rows){
                if(error) throw error;
                if (rows.length == 0){
                    connection.query("INSERT INTO userBookTable(userNo, bookNo, userPage, userTime, bookType) VALUES (?, ?, 0, 0, \"WillRead\")",
                    [userNo, groupBookNo], function(error, rows){
                        if(error) throw error;
                        res.status(200).json(rows);
                    });
                }
                else res.status(200).json(rows);
            });
            
        });
})

module.exports = router;