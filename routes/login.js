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
    .get("/", (req, res) => {
        connection.query('SELECT * FROM userTable', function (error, results, fields) {
            if(error) throw error;
            for(let i = 0; i < results.length; i++){
                console.log(results[i]);
            }
        });
    })
    .post("/", (req, res) => {
        console.log(req.body.data);
        const userId = req.body.userId;
        const userPw = req.body.userPw;
        console.log(userId + " " + userPw);
        connection.query("SELECT * from userTable where userId = ? and userPw = ?", [userId, userPw], function(err, rows){
            if(rows.length==1){
                console.log("OK");
                res.status(200).json({'result' : 'ok', 'userNo' : rows[0].userNo, 'userId' : rows[0].userId, 'userName' : rows[0].userName});
            }else{
                res.status(401).json({'result' : 'fail'});
            }
        })
    })


module.exports = router;