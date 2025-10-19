const express = require('express');
const path = require('path');
const socket = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {

  console.log('New client! Its id – ' + socket.id);

  socket.on('join', (userName) => {
    users.push({name: userName, id:socket.id});
    socket.userName = userName;
    console.log('nowy uzytkownik:', users);
    socket.broadcast.emit('newUser', {author: 'Chat bot', content:`${userName} has joined the conversation!`});
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    users = users.filter(i => i.id !== socket.id);
    if(socket.userName){
    socket.broadcast.emit('removeUser', {author: 'Chat bot', content:`${socket.userName} has left the conversation... :(}`})};
  });

  console.log('I\'ve added a listener on message event \n');
});

server.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
