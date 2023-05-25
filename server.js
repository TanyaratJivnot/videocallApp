
const express = require('express');
const app = express();
const server = require('http').Server(app);
/* uuid */
const {v4: uuidv4} = require('uuid');
/* SOCKET.IO */
const io = require('socket.io')(server)
/* Peer web rpc */
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug: true
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/peerjs', peerServer);
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});
/* create room id  */
app.get('/:room',(req,res)=>{
    res.render('room.ejs',{roomId: req.params.room});
})
io.on('connection', socket=>{
    /* เข้าร่วมการใช้ห้อง zoom */
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId);
        /* socket.to(roomId).broadcast.emit('user-connected', userId); */
        socket.to(roomId).emit('user-connected', userId);

        /* message */
        socket.on('message', message =>{
            io.to(roomId).emit('createMessage', message)
        })
    })
})
server.listen(process.env.PORT || 3030);