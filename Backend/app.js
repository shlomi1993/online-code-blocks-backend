const fs = require('fs');
const path = require('path');

const dynamodb = require('./dynamodb');

const express = require('express');
const app = express();

const cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: cors });

const PORT = 8080;

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json()) 

app.get('/ping', (req, res) => {
    res.send('PONG')
});

app.get('/getblock', (req, res) => {
    let id = req.query.id;
    dynamodb.getBlock(res, id);
});

app.get('/getAllCodeBlocks', (req, res) => {
    dynamodb.getAllBlocks(res);
});

app.post('/createblock', (req, res) => {
    let title = req.body.title;
    dynamodb.putBlock(res, title);
});


app.put('/updateblock', (req, res) => {
    let id = req.query.id;
    let code = req.body.code;
    dynamodb.updateBlock(res, id, code);
});

app.delete('/deleteblock', (req, res) => {
    let id = req.query.id;
    dynamodb.deleteBlock(res, id);
});

const rooms = {};

io.on('connection', (socket) => { 
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    if (roomId in rooms) {
      rooms[roomId].push(socket.id);
    } else {
      rooms[roomId] = [socket.id];
    }
    const userType = 'student';//(rooms[room][0] === socket.id) ? 'mentor' : 'student';
    socket.to(roomId).emit('get_type', userType);
  });
  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('recieve_message', data.message)
  });
});

server.listen(PORT, () => console.log(`Online-Code-Blocks backend server is available on port ${PORT}.`));
