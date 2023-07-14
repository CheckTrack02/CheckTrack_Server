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
    .get("/get-group-issue-list", (req, res) => {
        console.log("GET GROUP ISSUE LIST");
        const groupNo = req.query.groupNo;
        connection.query('SELECT * FROM issueTable WHERE issueGroupNo = ?', [groupNo], function (error, rows){
            if(error) throw error;
            res.status(200).json(rows);
        });
    })

    .get("/get-issue-entity", (req, res) => {
        console.log("GET ISSUE ENTITY");
        const issueNo = req.query.issueNo;
        connection.query("SELECT * FROM issueTable WHERE issueNo = ?", [issueNo], function(error, rows){
            if(error) throw error;
            res.status(200).json(rows);
        });
    })


module.exports = router;