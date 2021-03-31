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
                  playerHands: [],
                  handFirstTurn: 0,
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

  handleMove = (j) => {
    if(this.state.lastHand === ''){
      const currentSuit = j.substring(j.length - 1, j.length);
      if(this.state.turn === 1){
        const arr = this.state.player1;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player1: arr, player1Move: j, currentSuit: currentSuit, handFirstTurn: 1, turn: 2, pile: pile})
      }
      else if(this.state.turn === 2){
        const arr = this.state.player2;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player2: arr, player2Move: j, currentSuit: currentSuit, handFirstTurn: 2, turn: 3, pile: pile})
      }
      else if(this.state.turn === 3){
        const arr = this.state.player3;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player3: arr, player3Move: j, currentSuit: currentSuit, handFirstTurn: 3, turn: 4, pile: pile})
      }
      else if(this.state.turn === 4){
        const arr = this.state.player4;
        const pile = [j];
        arr.splice(arr.indexOf(j), 1);
        this.setState({player4: arr, player4Move: j, currentSuit: currentSuit, handFirstTurn: 4, turn: 1, pile: pile})
      }
    }
    else if(this.state.turn === this.state.handFirstTurn){
      const winnerHandPlayer = this.calcWinnerHandPlayer();
      const pile = this.state.pile;
      pile.push(this.state.player1Move);
      pile.push(this.state.player2Move);
      pile.push(this.state.player3Move);
      pile.push(this.state.player4Move);
      if(winnerHandPlayer === this.state.lastHand){
        const hands = this.state.playerHands;
        hands[winnerHandPlayer - 1].concat(pile);
        this.setState({player1Move: '',
          player2Move: '',
          player3Move: '',
          player4Move: '',
          currentSuit: '',
          turn: winnerHandPlayer,
          pile: [],
          playerHands: hands,
          handFirstTurn: winnerHandPlayer,
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
          handFirstTurn: winnerHandPlayer,
          lastHand: winnerHandPlayer});
      }
    }
  }

  displayPlayer = (num) => {
    const rows = []
    for(let i = 0; i < 13; ++i){
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
          Board
          {this.state.turn}
          {this.state.currentSuit}
        </div>
        <div className = 'player3'>
          {this.displayPlayer(3)}
        </div>
        <div className = 'player4'>
          {this.displayPlayer(4)}
        </div>
      </div>
    )
  }
}

class Test extends React.Component{
  constructor(props){
    super(props);
    this.state = {str: ['asd', 'qwrwef', 'qwerty', 'tght']};
    this.set();
  }

  set = () => {
    let arr = this.state.str
    let ind = arr.indexOf('qwerty');
    arr.splice(ind, 1)
    this.setState({str: arr})
  }

  render(){
    
    return(
      <div>

        {this.state.str}
      </div>
      
    )
  }
}

ReactDOM.render(
  <DehlaPakad />,
  document.getElementById('root')
);