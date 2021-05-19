const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening to port 8000');

const players = {};
let id = 1;

const wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request){
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message){
        if(message.type === 'utf8'){
            const move = JSON.parse(message.utf8Data)
            if(move.type === 'login'){
                if(id <= 4){
                    move['id'] = id;
                    players[id] = connection;
                    console.log(move, 'connected as player', id)
                    players[id].send(JSON.stringify(move));
                    id += 1;
                    if(id === 5){
                        move['type'] = 'ready';
                        for(key in players){
                            players[key].send(JSON.stringify(move));
                        }
                    }
                }
                else{
                    connection.send(JSON.stringify({type: 'failed'}));
                }
            }
        }
    });
});