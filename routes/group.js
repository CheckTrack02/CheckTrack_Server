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
    .get("/get-group", (req, res) => {
        console.log("GET GROUP");
        const groupNo = req.query.groupNo;
        console.log(groupNo);
        connection.query('SELECT * FROM group_table WHERE group_no = ?', [groupNo], function (error, rows) {
            if(error) throw error;
            if(rows.length==1){
                res.status(200).json(rows[0]);
            }else{
                res.status(401);
            }
        });
    });


module.exports = router;