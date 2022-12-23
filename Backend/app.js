// Written by Shlomi Ben-Shushan.

const dynamodb = require('./dynamodb');

const cors = require('cors');
const express = require('express');
const app = express();

const corsHeader = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: corsHeader });

const PORT = 8080;

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(cors())

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

app.get('/getMentor', (req, res) => {
  const roomId = req.query.blockId;
  const mentor = (roomId in rooms) ? rooms[roomId][0] : null;
  res.json({ mentorId: mentor });
});

app.post('/createblock', (req, res) => {
  const title = req.body.title;
  dynamodb.putBlock(res, title);
});


app.put('/updateblock', (req, res) => {
  const id = req.query.id;
  const name = req.query.name;
  const code = req.body.code;
  console.log(id);
  console.log(code);
  dynamodb.updateBlock(res, id, name, code);
});

app.delete('/deleteblock', (req, res) => {
  const id = req.query.id;
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
  });

  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('recieve_message', data.message)
  });
  
  socket.on('bye', (data) => {
    try {
      const i = rooms[data.roomId].indexOf(data.socketId);
      rooms[data.roomId].splice(i, 1);
      socket.to(data.roomId).emit('recieve_message', rooms[roomId][0]);
    } catch (e) {}
  });
});

server.listen(PORT, () => console.log(`Online-Code-Blocks backend server is available on port ${PORT}.`));
