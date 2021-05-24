import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

const client = new W3CWebsocket ('ws://192.168.29.116:8000');


class DehlaPakad extends React.Component{
  constructor(props){
    super(props);
    this.state = {userId: 0,
                  userName: '',
                  team: 0,
                  cards: [],
                  turn: 0,
                  roundStartsWith: 0,
                  currentSuit: 'NA',
                  currentRoundMoves: {},
                  pile: [],
                  hands: {1: [], 2: []},
                  trump: 'NA',
                  previousRoundWinner: 0,
                  isLoggedIn: false,
                  readyToStart: false,
                  team1points: 0,
                  team2points: 0,
                  currentGameWinner: 0};
  }

  handleUName = (e) => {
    this.setState({userName: e.target.value});
  }

  handleTeam = (e) => {
    this.setState({team: e.target.value});
  }

  handleLogin = () => {
    if(this.state.userName !== '' && this.state.team != 0){
      client.send(JSON.stringify({
        type: 'login',
        userName: this.state.userName,
        team: this.state.team
      }));
    }
    else{
      alert('Please fill all the details');
    }
  }

  handleCardClick = (e) => {
    if(this.state.turn == this.state.userId){
      let next = 0;
      if(this.state.turn == 4){
        next = 1;
      }
      else{
        next = this.state.turn + 1;
      }
      let index = this.state.cards.indexOf(e.target.value);
      this.state.cards.splice(index, 1);
      if(this.state.currentSuit == 'NA'){
        client.send(JSON.stringify({
          type: 'firstMove',
          userId: this.state.userId,
          move: e.target.value
        }));
      }
      else if(this.state.trump == 'NA' && this.state.currentSuit != e.target.value.substring(0,1)){
        client.send(JSON.stringify({
          type: 'setTrump',
          userId: this.state.userId,
          move: e.target.value
        }));
      }
      else if(this.state.trump == 'NA' && this.state.currentSuit != e.target.value.substring(0,1)
                && next == this.state.roundStartsWith){
        client.send(JSON.stringify({
          type: 'setTrumpandOver',
          userId: this.state.userId,
          move: e.target.value
        }));
      }
      else if(next == this.state.roundStartsWith){
        client.send(JSON.stringify({
          type: 'roundOver',
          userId: this.state.userId,
          move: e.target.value
        }));
      }
      else{
        client.send(JSON.stringify({
          type: 'move',
          userId: this.state.userId,
          move: e.target.value
        }));
      }
    }
  }

  renderCards = () =>{
    const card = [];
    for(let i = 0; i < this.state.cards.length; ++i){
      if(this.state.cards[i].substring(1) == '14'){
        card.push(<button onClick = {this.handleCardClick} value = {this.state.cards[i]}>
          {this.state.cards[i].substring(0,1) + 'A'}
        </button>);
      }
      else if(this.state.cards[i].substring(1) == '13'){
        card.push(<button onClick = {this.handleCardClick} value = {this.state.cards[i]}>
          {this.state.cards[i].substring(0,1) + 'K'}
        </button>);
      }
      else if(this.state.cards[i].substring(1) == '12'){
        card.push(<button onClick = {this.handleCardClick} value = {this.state.cards[i]}>
          {this.state.cards[i].substring(0,1) + 'Q'}
        </button>);
      }
      else if(this.state.cards[i].substring(1) == '11'){
        card.push(<button onClick = {this.handleCardClick} value = {this.state.cards[i]}>
          {this.state.cards[i].substring(0,1) + 'J'}
        </button>);
      }
      else{
        card.push(<button onClick = {this.handleCardClick} value = {this.state.cards[i]}>
          {this.state.cards[i]}
        </button>);
      }      
    }
    return card;
  }
  
  renderBoard = () => {
    const board = [];
    const curr = {1: '', 2: '', 3: '', 4: ''};
    if(this.state.winner == 1){
      curr[1] = 'winner';
      curr[3] = 'winner';
    }
    else if(this.state.winner == 2){
      curr[2] = 'winner';
      curr[4] = 'winner';
    }
    else if(this.state.turn == 1){
      curr[1] = 'current';
    }
    else if(this.state.turn == 2){
      curr[2] = 'current';
    }
    else if(this.state.turn == 3){
      curr[3] = 'current';
    }
    else if(this.state.turn == 4){
      curr[4] = 'current';
    }
    if(this.state.userId == 1){
      board.push(<div>
                    <div className = {curr[3] + 'placement2'}>
                      Player 3:
                      {this.state.currentRoundMoves[3]}
                    </div>
                    <div className = {curr[2] + 'placement1'}>
                      Player 2:
                      {this.state.currentRoundMoves[2]}
                    </div>
                    <div className = 'pile'>
                      turn: {this.state.turn} <br />
                      trump: {this.state.trump} <br />
                      currentSuit: {this.state.currentSuit} <br />
                      previousRoundWinner: {this.state.previousRoundWinner} <br />
                      roundStartsWith: {this.state.roundStartsWith} <br />
                      pile: {this.state.pile} <br />
                      team1hands: {this.state.hands[1]} <br />
                      team2hands: {this.state.hands[2]}
                    </div>
                    <div className = {curr[4] + 'placement3'}>
                      Player 4:
                      {this.state.currentRoundMoves[4]}
                    </div>
                    <div className = {curr[1] + 'placement4'}>
                      Player 1:
                      {this.state.currentRoundMoves[1]}
                    </div>
                  </div>);
    }
    else if(this.state.userId == 2){
      board.push(<div>
                    <div className = {curr[4] + 'placement2'}>
                      Player 4:
                      {this.state.currentRoundMoves[4]}
                    </div>
                    <div className = {curr[3] + 'placement1'}>
                      Player 3:
                      {this.state.currentRoundMoves[3]}
                    </div>
                    <div className = 'pile'>
                      turn: {this.state.turn} <br />
                      trump: {this.state.trump} <br />
                      currentSuit: {this.state.currentSuit} <br />
                      previousRoundWinner: {this.state.previousRoundWinner} <br />
                      roundStartsWith: {this.state.roundStartsWith} <br />
                      pile: {this.state.pile} <br />
                      team1hands: {this.state.hands[1]} <br />
                      team2hands: {this.state.hands[2]}
                    </div>
                    <div className = {curr[1] + 'placement3'}>
                      Player 1:
                      {this.state.currentRoundMoves[1]}
                    </div>
                    <div className = {curr[2] + 'placement4'}>
                      Player 2:
                      {this.state.currentRoundMoves[2]}
                    </div>
                  </div>);
    }
    else if(this.state.userId == 3){
      board.push(<div>
                    <div className = {curr[1] + 'placement2'}>
                      Player 1:
                      {this.state.currentRoundMoves[1]}
                    </div>
                    <div className = {curr[4] + 'placement1'}>
                      Player 4:
                      {this.state.currentRoundMoves[4]}
                    </div>
                    <div className = 'pile'>
                      turn: {this.state.turn} <br />
                      trump: {this.state.trump} <br />
                      currentSuit: {this.state.currentSuit} <br />
                      previousRoundWinner: {this.state.previousRoundWinner} <br />
                      roundStartsWith: {this.state.roundStartsWith} <br />
                      pile: {this.state.pile} <br />
                      team1hands: {this.state.hands[1]} <br />
                      team2hands: {this.state.hands[2]}
                    </div>
                    <div className = {curr[2] + 'placement3'}>
                      Player 2:
                      {this.state.currentRoundMoves[2]}
                    </div>
                    <div className = {curr[3] + 'placement4'}>
                      Player 3:
                      {this.state.currentRoundMoves[3]}
                    </div>
                  </div>);
    }
    else if(this.state.userId == 4){
      board.push(<div>
                    <div className = {curr[2] + 'placement2'}>
                      Player 2:
                      {this.state.currentRoundMoves[2]}
                    </div>
                    <div className = {curr[1] + 'placement1'}>
                      Player 1:
                      {this.state.currentRoundMoves[1]}
                    </div>
                    <div className = 'pile'>
                      turn: {this.state.turn} <br />
                      trump: {this.state.trump} <br />
                      currentSuit: {this.state.currentSuit} <br />
                      previousRoundWinner: {this.state.previousRoundWinner} <br />
                      roundStartsWith: {this.state.roundStartsWith} <br />
                      pile: {this.state.pile} <br />
                      team1hands: {this.state.hands[1]} <br />
                      team2hands: {this.state.hands[2]}
                    </div>
                    <div className = {curr[3] + 'placement3'}>
                      Player 3:
                      {this.state.currentRoundMoves[3]}
                    </div>
                    <div className = {curr[4] + 'placement4'}>
                      Player 4:
                      {this.state.currentRoundMoves[4]}
                    </div>
                  </div>);
    }
    board.push(<div className = 'placement5'>
                  {this.renderCards()}
                </div>);
    return board;
  }

  calcRoundWinner = () => {
    let highest = 0;
    let winner = 0;
    let Team1hand = this.state.hands[1].slice();
    let Team2hand = this.state.hands[2].slice();
    let pile = this.state.pile.slice();
    
    if(this.state.currentRoundMoves[1].substring(0,1) == this.state.currentSuit
        && this.state.currentRoundMoves[2].substring(0,1) == this.state.currentSuit
        && this.state.currentRoundMoves[3].substring(0,1) == this.state.currentSuit
        && this.state.currentRoundMoves[4].substring(0,1) == this.state.currentSuit){
      for(let i = 1; i <=4; ++i){
        if(parseInt(this.state.currentRoundMoves[i].substring(1)) > parseInt(highest)){
          highest = this.state.currentRoundMoves[i].substring(1);
          winner = i;
        }
      }
    }
    else if(this.state.currentRoundMoves[1].substring(0,1) != this.state.trump
              && this.state.currentRoundMoves[2].substring(0,1) != this.state.trump
              && this.state.currentRoundMoves[3].substring(0,1) != this.state.trump
              && this.state.currentRoundMoves[4].substring(0,1) != this.state.trump){
      for(let i = 1; i <=4; ++i){
        if(parseInt(this.state.currentRoundMoves[i].substring(1)) > parseInt(highest)
            && this.state.currentRoundMoves[i].substring(0,1) == this.state.currentSuit){
          highest = this.state.currentRoundMoves[i].substring(1);
          winner = i;
        }
      }
    }
    else{
      for(let i = 1; i <=4; ++i){
        if(parseInt(this.state.currentRoundMoves[i].substring(1)) > parseInt(highest)
            && this.state.currentRoundMoves[i].substring(0,1) == this.state.trump){
          highest = this.state.currentRoundMoves[i].substring(1);
          winner = i;
        }
      }
    }

    for(let i = 1; i <= 4; ++i){
      pile = pile.concat(this.state.currentRoundMoves[i]);
    }
    
    if(this.state.cards.length == 0){
      if(winner == 1 || winner == 3){
        Team1hand = this.state.hands[1].concat(pile);
      }
      else{
        Team2hand = this.state.hands[2].concat(pile);
      }
      this.setState({pile: [],
                      hands: {1: Team1hand, 2: Team2hand},
                      previousRoundWinner: winner
      });
      this.calcGameWinner();
    }
    else{
      if(winner == this.state.previousRoundWinner){
        if(winner == 1 || winner == 3){
          Team1hand = this.state.hands[1].concat(pile);
        }
        else{
          Team2hand = this.state.hands[2].concat(pile);
        }
        this.setState({turn: winner,
                        hands: {1: Team1hand, 2: Team2hand},
                        previousRoundWinner: 0,
                        pile: [],
                        currentRoundMoves: {},
                        roundStartsWith: winner,
                        currentSuit: 'NA'
        });
      }
      else{
        this.setState({turn: winner,
                        previousRoundWinner: winner,
                        pile: pile,
                        currentRoundMoves: {},
                        roundStartsWith: winner,
                        currentSuit: 'NA'
        });
      }
    }
  }

  calcGameWinner = () => {
    let team1points = 0;
    let team2points = 0;
    for(let i = 0; i < this.state.hands[1].length; ++i){
      if(this.state.hands[1][i].substring(1) == '10'){
        team1points += 1;
      }
    }
    for(let i = 0; i < this.state.hands[2].length; ++i){
      if(this.state.hands[2][i].substring(1) == '10'){
        team2points += 1;
      }
    }
    let temp1 = this.state.team1points;
    let temp2 = this.state.team2points;
    if(team1points == 4){
      temp1 += 3;
      this.setState({currentGameWinner: 1, team1points: temp1});
    }
    else if(team2points == 4){
      temp2 += 3;
      this.setState({currentGameWinner: 2, team2points: temp2});
    }
    else if(team1points == 3){
      temp1 += 2;
      this.setState({currentGameWinner: 1, team1points: temp1});
    }
    else if(team2points == 3){
      temp2 += 2;
      this.setState({currentGameWinner: 2, team2points: temp2});
    }
    else if(team1points == team2points){
      if(this.state.hands[1].length > this.state.hands[2].length){
        temp1 += 1;
        this.setState({currentGameWinner: 1, team1points: temp1});
      }
      else if(this.state.hands[1].length < this.state.hands[2].length){
        temp2 += 1;
        this.setState({currentGameWinner: 2, team1points: temp2});
      }
    }
  }

  componentDidMount(){
    client.onopen = () => {
      console.log('Connected');
    }

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if(dataFromServer.type === 'login'){
        this.setState({userId: dataFromServer.id, isLoggedIn: true});
      }
      else if(dataFromServer.type === 'roomFull'){
        alert('Room Full');
      }
      else if(dataFromServer.type === 'teamFull'){
        alert('Team full, please try other team');
      }
      else if(dataFromServer.type === 'ready'){
        this.setState({readyToStart: true, cards: dataFromServer.cards, turn: 1, roundStartsWith: 1});
      }
      else{
        const thisRound = this.state.currentRoundMoves;
        thisRound[dataFromServer.userId] = dataFromServer.move;
        let next = 0;
        if(this.state.turn == 4){
          next = 1;
        }
        else{
          next = this.state.turn + 1;
        }
        if(dataFromServer.type === 'firstMove'){
          this.setState({roundStartsWith: dataFromServer.userId,
                          turn: next,
                          currentRoundMoves: thisRound,
                          currentSuit: dataFromServer.move.substring(0,1)
                        });
        }
        else if(dataFromServer.type === 'setTrump'){
          this.setState({turn: next,
                          currentRoundMoves: thisRound,
                          trump: dataFromServer.move.substring(0,1)
                        });
        }
        else if(dataFromServer.type === 'setTrumpandOver'){
          this.setState({currentRoundMoves: thisRound,
                          trump: dataFromServer.move.substring(0,1)
                        });
          this.calcRoundWinner();
        }
        else if(dataFromServer.type === 'roundOver'){
          this.setState({currentRoundMoves: thisRound
          });
          this.calcRoundWinner();
        }
        else if(dataFromServer.type === 'move'){
          this.setState({turn: next,
                          currentRoundMoves: thisRound
          });
        }
      }
    }
  }

  render(){
    return(
      <div>
        {this.state.isLoggedIn ? 
          <div>
            {this.state.readyToStart ?
              <div className = 'board'>
                {this.renderBoard()}
              </div>
              : 'Waiting for other Player to join.'}
          </div>
          : <div>
              <p className = 'header'>Delha Pakad</p>
              <br />
              <input className = 'userName' placeholder = 'Enter Username' onChange = {this.handleUName} />
              <button className = 'login' onClick = {this.handleLogin}>
                Login
              </button>
              <br />
              <div className = 'selectTeam'>
                Select Team:
                <select className = 'team' onChange = {this.handleTeam} >
                  <option value = '0' />
                  <option value = '1' >Team 1</option>
                  <option value = '2' >Team 2</option>
                </select>
              </div>
            </div>
        }
      </div>
    )
  }
}

class Test extends React.Component{
  abc = () => {
    const a = {1: '', 2: ''};
    a[1] = 'aas';
    return a;
  }

  render(){
    return(this.abc());
  }
}

ReactDOM.render(
  <DehlaPakad />, document.getElementById('root')
);