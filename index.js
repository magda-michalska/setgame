'use strict'

let http = require('http');
let express = require('express');
//let socketio = require('socket.io');

//var app = connect().use(connect.static('public')).listen(3000);

let app = express();
let server = http.createServer(app);
//let io = socketio(server);

app.use(express.static(__dirname + '/dist'));
server.listen(8080, () => console.log('Ready to work!'));

