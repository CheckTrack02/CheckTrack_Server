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
    .post("post-group-entity", (req, res) => {
        console.log("POST GROUP");
        const groupName = req.body.groupName;
        const groupBookNo = req.body.groupBookNo;
        const groupStartDate = req.body.groupStartDate;
        const groupEndDate = req.body.groupEndDate;
        const userList = req.body.userList;
        connection.query("INSERT INTO groupTable(groupName, groupBookNo, groupStartDate, groupEndDate) VALUES (?, ?, ?, ?)", 
        [groupName, groupBookNo, groupStartDate, groupEndDate], function(error, groupRows){
            if(error) throw error;
            for (userNo in userList){
                connection.query("INSERT INTO groupUserTable(groupNo, userNo, userPage, userTime) VALUES (?, ?, 0, 0)",
                [groupRows.groupNo, userNo], function(error, rows){
                    if(error) throw error;
                    connection.query("INSERT INTO userBookTable(userNo, bookNo, userPage, userTime, bookType) VALUES (?, ?, 0, 0, \"WillRead\")",
                        [userNo, groupBookNo], function(error, rows){
                            if(error) throw error;
                            res.status(200).json(rows);
                        });
                });
            }
            
        });
    })




module.exports = router;