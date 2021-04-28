import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const deck = ['A S','2 S','3 S','4 S','5 S','6 S','7 S','8 S','9 S','10 S','J S','Q S','K S',
              'A H','2 H','3 H','4 H','5 H','6 H','7 H','8 H','9 H','10 H','J H','Q H','K H',
              'A C','2 C','3 C','4 C','5 C','6 C','7 C','8 C','9 C','10 C','J C','Q C','K C',
              'A D','2 D','3 D','4 D','5 D','6 D','7 D','8 D','9 D','10 D','J D','Q D','K D'];

const highest = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

class DehlaPakad extends React.Component{
  constructor(props){
    super(props);
    this.shuffle();
    this.state = {player1: this.setPlayer(0),
                  player2: this.setPlayer(1),
                  player3: this.setPlayer(2),
                  player4: this.setPlayer(3),
                  player1Move: '',
                  player2Move: '',
                  player3Move: '',
                  player4Move: '',
                  currentSuit: '',
                  trump: '',
                  turn: 1,
                  pile: [],
                  playerHands: [0, 0, 0, 0],
                  handLastTurn: 0,
                  lastHand: ''};
  }
  
  shuffle = () => {
    for(let i = 51; i > 0; --i){
      const j = Math.floor(Math.random() * (i+1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  }
  
  setPlayer = (num) => {
    const arr = []
    for(let i = 0 + num; i < 52; i = i + 4){
      arr.push(deck[i]);
    }
    return arr;
  }

  maximum = (arr) => {
    for(let i = 0; i < 4; ++i){
      if(arr[i] === 'A'){
        arr[i] = 14;
      }
      else if(arr[i] === 'J'){
        arr[i] = 11;
      }
      else if(arr[i] === 'Q'){
        arr[i] = 12;
      }
      else if(arr[i] === 'K'){
        arr[i] = 13;
      }
      else{
        arr[i] = parseInt(arr[i]);
      }
    }

    return arr.indexOf(Math.max.apply(null, arr)) + 1;
  }

  calcWinnerHandPlayer = () => {
    const possibleWinner = [0, 0, 0, 0];
    let isTrumpUsed = 'n'
    let j = this.state.player1Move;
    const player1Card = [j.substring(0, j.indexOf(' ')) , j.substring(j.length - 1, j.length)]
    j = this.state.player2Move;
    const player2Card = [j.substring(0, j.indexOf(' ')) , j.substring(j.length - 1, j.length)]
    j = this.state.player3Move;
    const player3Card = [j.substring(0, j.indexOf(' ')) , j.substring(j.length - 1, j.length)]
    j = this.state.player4Move;
    const player4Card = [j.substring(0, j.indexOf(' ')) , j.substring(j.length - 1, j.length)]

    if (player1Card[1] === this.state.trump){
      possibleWinner[0] = player1Card[0];
      isTrumpUsed = 'y';
    }

    if (player2Card[1] === this.state.trump){
      possibleWinner[1] = player2Card[0];
      isTrumpUsed = 'y';
    }

    if (player3Card[1] === this.state.trump){
      possibleWinner[2] = player3Card[0];
      isTrumpUsed = 'y';
    }

    if (player4Card[1] === this.state.trump){
      possibleWinner[3] = player4Card[0];
      isTrumpUsed = 'y';
    }

    if(isTrumpUsed === 'n'){
      if (player1Card[1] === this.state.currentSuit){
        possibleWinner[0] = player1Card[0];
      }
  
      if (player2Card[1] === this.state.currentSuit){
        possibleWinner[1] = player2Card[0];
      }
  
      if (player3Card[1] === this.state.currentSuit){
        possibleWinner[2] = player3Card[0];
      }
  
      if (player4Card[1] === this.state.currentSuit){
        possibleWinner[3] = player4Card[0];
      }
    }

    return this.maximum(possibleWinner);
  }

  handleMove = (j) => {
    if(this.state.turn === this.state.handLastTurn){
      if(this.state.turn === 1){
        this.setState({player1Move: j});
      }
      else if(this.state.turn === 2){
        this.setState({player2Move: j});
      }
      else if(this.state.turn === 3){
        this.setState({player3Move: j});
      }
      else if(this.state.turn === 4){
        this.setState({player4Move: j});
      }
	  
      const winnerHandPlayer = this.calcWinnerHandPlayer();
      const pile = this.state.pile;
      pile.push(this.state.player1Move);
      pile.push(this.state.player2Move);
      pile.push(this.state.player3Move);
      pile.push(this.state.player4Move);
      if(winnerHandPlayer === this.state.lastHand){
        const hands = this.state.playerHands;
        hands[winnerHandPlayer - 1] = hands[winnerHandPlayer - 1] === 0 ? pile : hands[winnerHandPlayer - 1].concat(pile);
        this.setState({player1Move: '',
          player2Move: '',
          player3Move: '',
          player4Move: '',
          currentSuit: '',
          turn: winnerHandPlayer,
          pile: [],
          playerHands: hands,
          lastHand: ''});
      }
      else{
        this.setState({player1Move: '',
          player2Move: '',
          player3Move: '',
          player4Move: '',
          currentSuit: '',
          turn: winnerHandPlayer,
          pile: pile,
          lastHand: winnerHandPlayer});
      }
    }
    else if(this.state.currentSuit === '') {
      const currentSuit = j.substring(j.length - 1, j.length);
      if(this.state.turn === 1){
        const arr = this.state.player1;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player1: arr, player1Move: j, currentSuit: currentSuit, handLastTurn: 4, turn: 2, pile: pile})
      }
      else if(this.state.turn === 2){
        const arr = this.state.player2;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player2: arr, player2Move: j, currentSuit: currentSuit, handLastTurn: 1, turn: 3, pile: pile})
      }
      else if(this.state.turn === 3){
        const arr = this.state.player3;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player3: arr, player3Move: j, currentSuit: currentSuit, handLastTurn: 2, turn: 4, pile: pile})
      }
      else if(this.state.turn === 4){
        const arr = this.state.player4;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player4: arr, player4Move: j, currentSuit: currentSuit, handLastTurn: 3, turn: 1, pile: pile})
      }
    }
    else {
      const currentMoveSuit = j.substring(j.length - 1, j.length);
      let possibleTrump = this.state.trump;
      if(this.state.trump === ''){
        possibleTrump = this.state.currentSuit === currentMoveSuit ? '' : currentMoveSuit;
      }
      if(this.state.turn === 1){
        const arr = this.state.player1;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player1: arr, player1Move: j, turn: 2, pile: pile, trump: possibleTrump})
      }
      else if(this.state.turn === 2){
        const arr = this.state.player2;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player2: arr, player2Move: j, turn: 3, pile: pile, trump: possibleTrump})
      }
      else if(this.state.turn === 3){
        const arr = this.state.player3;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player3: arr, player3Move: j, turn: 4, pile: pile, trump: possibleTrump})
      }
      else if(this.state.turn === 4){
        const arr = this.state.player4;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player4: arr, player4Move: j, turn: 1, pile: pile, trump: possibleTrump})
      }      
    }
  }

  displayPlayer = (num) => {
    const rows = []
    const len = num === 1 ? this.state.player1.length :
                  (num === 2 ? this.state.player2.length:
                    (num === 3 ? this.state.player3.length : this.state.player4.length))
    for(let i = 0; i < len; ++i){
      if(num === 1){
        const row = (
          <div>
            <button onClick = {(j) => this.handleMove(this.state.player1[i])}>
              {this.state.player1[i]}
            </button>
          </div>
        )
        rows.push(row);
      }
      else if(num === 2){
        const row = (
          <button onClick = {(j) => this.handleMove(this.state.player2[i])}>
            {this.state.player2[i]}
          </button>
        )
        rows.push(row);
      }
      else if(num === 3){
        const row = (
          <div>
            <button onClick = {(j) => this.handleMove(this.state.player3[i])}>
              {this.state.player3[i]}
            </button>
          </div>
        )
        rows.push(row);
      }
      else if(num === 4){
        const row = (
          <button onClick = {(j) => this.handleMove(this.state.player4[i])}>
            {this.state.player4[i]}
          </button>
        )
        rows.push(row);
      }
    }
    return rows;
  }

  render(){
    return(
      <div>
        <div className = 'player1'>
          {this.displayPlayer(1)}
        </div>
        <div className = 'player2'>
          {this.displayPlayer(2)}
        </div> 
        <div className = 'board' >
          <div className = 'player1board' >
            {this.state.player1Move}
          </div>
          <div className = 'player2board' >
            {this.state.player2Move}
          </div>
          <div className = 'player4board' >
            {this.state.player4Move}
          </div>
          <div className = 'player3board' >
            {this.state.player3Move}
          </div>
        </div>
        <div className = 'player3'>
          {this.displayPlayer(3)}
        </div>
        <div className = 'stats' >
          turn: {this.state.turn}<br />
          trump: {this.state.trump}<br />
          currentSuit: {this.state.currentSuit}<br />
          lastHand: {this.state.lastHand}<br />
          first: {this.state.handLastTurn}<br />
          Pl1-Hands: {this.state.playerHands[0]}<br />
          Pl2-Hands: {this.state.playerHands[1]}<br />
          Pl3-Hands: {this.state.playerHands[2]}<br />
          Pl4-Hands: {this.state.playerHands[3]}
        </div>
        <div className = 'player4'>
          {this.displayPlayer(4)}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <DehlaPakad />,
  document.getElementById('root')
);