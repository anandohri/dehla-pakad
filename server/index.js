const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening to port 8000');

const players = {};
const cards = {};
let id = 1;
let team1_id = 1;
let team2_id = 1;

const deck = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13',
							'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13',
							'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13',
							'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'];

const shuffle = () => {
  for(let i = 51; i > 0; --i){
    const j = Math.floor(Math.random() * (i+1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
	}

	for(let j = 1; j <=4; ++j){
		const arr = []
    for(let i = 0 + j - 1; i < 52; i = i + 4){
      arr.push(deck[i]);
    }
    cards[j] = arr;
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
          if((team1_id === 3 && move.team == 1)
              || (team2_id === 3 && move.team == 2)){
            connection.send(JSON.stringify({type: 'teamFull'}));
          }
          else{
            let temp = 0;
            if(move.team == 1){
              if(team1_id === 1){
                temp = 1;
              }
              else{
                temp = 3;
              }
              team1_id += 1;
            }
            else{
            	if(team2_id === 1){
                temp = 2;
              }
              else{
                temp = 4;
              }
              team2_id += 1;
            }
            move['id'] = temp;
            players[temp] = connection;
            console.log(move, 'connected as player', temp)
            players[temp].send(JSON.stringify(move));
            id += 1;
            if(id === 5){
              move['type'] = 'ready';
              for(key in players){
								move['cards'] = cards[key];
                players[key].send(JSON.stringify(move));
              }
            }
          }
        }
        else{
          connection.send(JSON.stringify({type: 'roomFull'}));
        }
      }
    }
  });
});