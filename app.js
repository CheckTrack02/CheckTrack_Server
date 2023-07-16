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
const io = socketIO(server);


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
app.use('/userBook', userBookRoute);



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
        console.log(data.userNo);
        console.log(data.startTime);
        console.log(data.bookNo)
    })
})

const PORT = 443;
server.listen(PORT, () => console.log('Run on server ' + PORT));