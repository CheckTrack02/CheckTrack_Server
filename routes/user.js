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
    .get("/get-user-entity", (req, res) => {
        console.log("GET USER ENTITY");
        const userNo = req.query.userNo;
        //console.log(userNo);
        connection.query('SELECT * FROM userTable WHERE userNo = ?', [userNo], function (error, rows) {
            if(error) throw error;
            if(rows.length==1){
                res.status(200).json(rows[0]);
            }else{
                res.status(401);
            }
        });
    })
    .get("/get-name-user-entity", (req, res) => {
        console.log("GET NAME USER ENTITY");
        const userName = req.query.userName;
        connection.query('SELECT * FROM userTable WHERE userName = \' ? \'', [userName], function (error, rows){
            if(error)   throw error;
            if(rows.length==1){
                res.status(200).json(rows[0]);
            }else{
                res.status(401);
            }
        });
    })
    .get("/get-group-user-no-list", (req, res) => {
        console.log("GET GROUP USER NO LIST");
        const groupNo = req.query.groupNo;
        console.log(groupNo);
        connection.query('SELECT userNo FROM groupUserTable WHERE groupNo = ?', [groupNo], function (error, rows){
            if(error) throw error;
            res.status(200).json(rows);
        });
    })
    .get("/get-group-user-entity", (req, res) => {
        console.log("GET GROUP USER ENTITY");
        const userNo = req.query.userNo;
        const groupNo = req.query.groupNo;
        connection.query('SELECT * FROM groupUserTable WHERE userNo = ? AND groupNo = ?', [userNo, groupNo], function (error, rows){
            if(error) throw error;
            if(rows.length == 1){
                res.status(200).json(rows[0]);
            }else{
                res.status(401);
            }
        });
    })


module.exports = router;