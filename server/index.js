const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening to port 8000');

const players = {};
let id = 1;

const deck = ['1 S','2 S','3 S','4 S','5 S','6 S','7 S','8 S','9 S','10 S','11 S','12 S','13 S',
                '1 H','2 H','3 H','4 H','5 H','6 H','7 H','8 H','9 H','10 H','11 H','12 H','13 H',
                '1 C','2 C','3 C','4 C','5 C','6 C','7 C','8 C','9 C','10 C','11 C','12 C','13 C',
                '1 D','2 D','3 D','4 D','5 D','6 D','7 D','8 D','9 D','10 D','11 D','12 D','13 D'];

const shuffle = () => {
    for(let i = 51; i > 0; --i){
        const j = Math.floor(Math.random() * (i+1));
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

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
                    if(id === 1){
                        shuffle();
                    }
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