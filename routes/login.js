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
        connection.query('SELECT * FROM user_table', function (error, results, fields) {
            if(error) throw error;
            for(let i = 0; i < results.length; i++){
                console.log(results[i]);
            }
        });
    })
    .post("/", (req, res) => {
        console.log(req.body.data);
        const user_id = req.body.user_id;
        const user_pw = req.body.user_pw;
        console.log(user_id + " " + user_pw);
        connection.query("SELECT * from user_table where user_id = ? and user_pw = ?", [user_id, user_pw], function(err, rows){
            if(rows.length==1){
                console.log("OK");
                res.status(200).json({'result' : 'ok', 'user_no' : rows[0].user_no, 'user_id' : rows[0].user_id, 'user_name' : rows[0].user_name});
            }else{
                res.status(401).json({'result' : 'fail'});
            }
        })
    })
    .post("/insert", (req, res) => {
        res.send("신규 고객 추가");
    });


module.exports = router;