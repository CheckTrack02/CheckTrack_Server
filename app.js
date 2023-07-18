const express = require('express');

const app = express();
const port = 80;
const userRoute = require('./routes/user');
const loginRoute = require('./routes/login');
const groupRoute = require('./routes/group');
const bookRoute = require('./routes/book');
const issueRoute = require('./routes/issue');
const commentRoute = require('./routes/comment');
const userBookRoute = require('./routes/userBook');

const http = require("http");
const server = http.createServer(app);

const socketIO = require("socket.io");
const moment = require("moment");
const io = socketIO(server, {'pingInterval' : 5000, 'pingTimeout' : 10000});


app.use(express.json({
    limit: '50mb'
}));

app.listen(port, () => console.log('80번 포트에서 대기중'));

app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/group', groupRoute);
app.use('/book', bookRoute);
app.use('/issue', issueRoute);
app.use('/comment', commentRoute);
app.use('/user-book', userBookRoute);

/* MySQL */

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'checktrack'
});
connection.connect();


/*  Socket IO */

var roomUserNameMap = new Map();
var roomUserTimeMap = new Map();
var roomUserPageMap = new Map();
var roomStartTimeMap = new Map();
var socketUserNameMap = new Map();
var socketRoomNoMap = new Map();


io.on("connection", (socket)=>{
    console.log(socket.id, ' connected!');
    socket.on("chatting", (data) => {
        const {name, msg, } = data;

        io.emit("chatting", {
            name,
            msg: msg,
            time: moment(new Date()).format("h:ss A")
        })
    })
    socket.on("message", (data) => {
        console.log("From Client: " + data);
        io.emit('message', "Hello Server");
    })
    socket.on("timer-startTimer", (data) => {
        console.log("timer-startTimer");
        const userNo = data.userNo;
        const userName = data.userName;
        socketUserNameMap.set(socket.id, userName);
        const bookNo = data.bookNo;
        const startTime = data.startTime;
        const roomNo = bookNo;
        socketRoomNoMap.set(socket.id, roomNo);
        const roomName = "room" + roomNo.toString();
        socket.join(roomName);
        


        if(roomUserNameMap.get(roomNo) == undefined){
            roomUserNameMap.set(roomNo, []);
            roomUserTimeMap.set(roomNo, []);
            roomUserPageMap.set(roomNo, []);
            roomStartTimeMap.set(roomNo, []);
        }
        var roomUserNameList = roomUserNameMap.get(roomNo);
        var roomUserTimeList = roomUserTimeMap.get(roomNo);
        var roomUserPageList = roomUserPageMap.get(roomNo);
        var roomStartTimeList = roomStartTimeMap.get(roomNo);

        console.log(userName + " " + startTime.toString());

        var sendUserTimeList = [];
        var sendUserPageList = [];

        for(var i = 0; i < roomUserNameList.length; i++){
            //console.log(roomUserNameList[i]);
            const currentUserStartTime = roomStartTimeList[i];
            const currentUserDuration = Math.floor((startTime - currentUserStartTime) / 1000);
            const recentUserTime = roomUserTimeList[i];
            const recentUserPage = roomUserPageList[i];
            const currentUserTime = recentUserTime + currentUserDuration;
            const currentUserPage = Math.floor((recentUserPage * currentUserTime) / recentUserTime);
            //console.log(recentUserTime + " " + recentUserPage);
            //console.log(currentUserTime + " " + currentUserPage);
            //console.log(currentUserDuration);
            sendUserTimeList.push(currentUserTime);
            sendUserPageList.push(currentUserPage);
        }

        socket.emit('userList', {
            'roomUserNameList': roomUserNameList,
            'roomUserTimeList': sendUserTimeList,
            'roomUserPageList': sendUserPageList,
        });

        connection.query("SELECT * FROM userBookTable WHERE userNo = ? AND bookNo = ?", [userNo, bookNo], function(error, rows){
            if(rows.length==1){
                console.log("UPDATE MAP");
                const userPage = rows[0]['userPage'];
                const userTime = rows[0]['userTime'];
                roomUserNameList.push(userName);
                roomUserTimeList.push(userTime);
                roomUserPageList.push(userPage);
                roomStartTimeList.push(startTime);
                roomUserNameMap.set(roomNo, roomUserNameList);
                roomUserTimeMap.set(roomNo, roomUserTimeList);
                roomUserPageMap.set(roomNo, roomUserPageList);
                roomStartTimeMap.set(roomNo, roomStartTimeList);

        
                io.to(roomName).emit('updateUser', {
                    'userName': userName,
                    'userTime': userTime,
                    'userPage': userPage,
                    'startTime': startTime
                });
            }
        });
        
        //console.log("Client " + socket.id + " joined " + roomName);
    })
    socket.on('disconnect', function(){
        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnected");
        const userName = socketUserNameMap.get(socket.id);
        const roomNo = socketRoomNoMap.get(socket.id);
        const roomName = "room" + roomNo.toString();
        const roomUserNameList = roomUserNameMap.get(roomNo);
        const roomUserTimeList = roomUserTimeMap.get(roomNo);
        const roomUserPageList = roomUserPageMap.get(roomNo);
        const roomStartTimeList = roomStartTimeMap.get(roomNo);
        var userTime = 0;
        var userPage = 0;
        var userStartTime = 0;
        for(var i=0; i<roomUserNameList.length; i++){
            if(roomUserNameList[i]==userName){
                userTime = roomUserTimeList[i];
                userPage = roomUserPageList[i];
                userStartTime = roomStartTimeList[i];
                roomUserNameList.splice(i, 1);
                roomUserTimeList.splice(i, 1);
                roomUserPageList.splice(i, 1);
                roomStartTimeList.splice(i, 1);
                break;
            }
        }
        console.log(roomName);
        io.to(roomName).emit('removeUser', {
            'userName': userName,
            'userTime': userTime,
            'userPage': userPage,
            'startTime': userStartTime
        });
        roomUserNameMap.set(roomNo, roomUserNameList);
        roomUserTimeMap.set(roomNo, roomUserTimeList);
        roomUserPageMap.set(roomNo, roomUserPageList);
        roomStartTimeMap.set(roomNo, roomStartTimeList);
    })
    socket.on('timer-updateBookPage', function(data){
        const userName = socketUserNameMap.get(socket.id);
        const userPage = data.userPage;
        const userTime = data.userTime;
        const startTime = data.startTime;
        const roomNo = socketRoomNoMap.get(socket.id);
        const roomName = "room" + roomNo.toString();
        const roomUserNameList = roomUserNameMap.get(roomNo);
        const roomUserTimeList = roomUserTimeMap.get(roomNo);
        const roomUserPageList = roomUserPageMap.get(roomNo);
        const roomStartTimeList = roomStartTimeMap.get(roomNo);
        for(var i=0; i<roomUserNameList.length; i++){
            if(roomUserNameList[i]==userName){
                roomUserTimeList[i] = userTime;
                roomUserPageList[i] = userPage;
                roomStartTimeList[i] = startTime;
                roomUserTimeMap[roomNo] = roomUserTimeList;
                roomUserPageMap[roomNo] = roomUserPageList;
                roomStartTimeMap[roomNo] = roomStartTimeList;
                io.to(roomName).emit('updateUser', {
                    'userName': userName,
                    'userTime': userTime,
                    'userPage': userPage,
                    'startTime': startTime
                });
                break;
            }
        }

    })
})

const PORT = 443;
server.listen(PORT, () => console.log('Run on server ' + PORT));