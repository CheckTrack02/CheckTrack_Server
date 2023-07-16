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
    .get("/get-group-issue-comment-list", (req, res) => {
        console.log("GET GROUP COMMENT LIST");
        const issueNo = req.query.issueNo;
        console.log(issueNo);
        connection.query('SELECT * FROM commentTable WHERE commentIssueNo = ?', [issueNo], function (error, rows){
            if(error) throw error;
            res.status(200).json(rows);
        });
    })




module.exports = router;