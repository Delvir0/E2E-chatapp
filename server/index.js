const e = require('express');
const express = require('express');
const app     = express();
const http    = require('http').createServer(app);
const io      = require('socket.io')(http);


app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../handlers/browser'));

http.listen(3000);

const users = {}
count = 0

console.log('Server is listening on http://localhost:3000');

io.on('connection', socket => {
    console.log('connected...');
    count++

    if (count >= 3) {
        socket.emit('too many users')
        socket.disconnect()
    }

    users[socket.id] = {
        id: socket.id,
    };

    socket.emit('get socket id', {
        id: socket.id
    } )

    socket.on('send message', payload => {
        socket.broadcast.emit('broadcast message', {
            message: payload.encryptedMessage
        });
        
    })

    socket.on('send keys', input => {

        users[socket.id] = {
            pKey: input.publicKey
        }
    });

    socket.on('request pKey', id => {
        if (count < 2) {
            socket.emit('second user')
        }
        else {
            for (user in users) {
                if (id.id != user) {
                    socket.emit('get pKey', {
                        key: users[user].pKey
                    })
                }
            }
        }
    })

});