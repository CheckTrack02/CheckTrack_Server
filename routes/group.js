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




module.exports = router;