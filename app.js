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

/*  Socket IO */

var socketMap = new Map();


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
        const bookNo = data.bookNo;
        const startTime = data.startTime;
        const roomName = "room" + bookNo.toString();
        socket.join(roomName);
        

        console.log("Client " + socket.id + " joined " + roomName);
    })
    socket.on('disconnect', function(){
        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnected");
    })
    //socket.onDisconnect((_) => print('disconnect'));
})

const PORT = 443;
server.listen(PORT, () => console.log('Run on server ' + PORT));