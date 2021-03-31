import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let deck = ['A S','2 S','3 S','4 S','5 S','6 S','7 S','8 S','9 S','10 S','J S','Q S','K S',
              'A H','2 H','3 H','4 H','5 H','6 H','7 H','8 H','9 H','10 H','J H','Q H','K H',
              'A C','2 C','3 C','4 C','5 C','6 C','7 C','8 C','9 C','10 C','J C','Q C','K C',
              'A D','2 D','3 D','4 D','5 D','6 D','7 D','8 D','9 D','10 D','J D','Q D','K D']

class DehlaPakad extends React.Component{
  constructor(props){
    super(props);
    this.shuffle();
    this.state = {player1: this.setPlayer(0),
                  player2: this.setPlayer(1),
                  player3: this.setPlayer(2),
                  player4: this.setPlayer(3),
                  trump: '',
                  turn: '',
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

  handleMove = (i) => {
    this.setState({turn: 'Player' + i})
  }

  displayPlayer = (num) => {
    const rows = []
    for(let i = 0; i < 13; ++i){
      if(num === 1){
        const row = (
          <div>
            <button onClick = {(i) => this.handleMove(1)}>
              {this.state.player1[i]}
            </button>
          </div>
        )
        rows.push(row);
      }
      else if(num === 2){
        const row = (
          <button onClick = {(i) => this.handleMove(2)}>
            {this.state.player2[i]}
          </button>
        )
        rows.push(row);
      }
      else if(num === 3){
        const row = (
          <div>
            <button onClick = {(i) => this.handleMove(3)}>
              {this.state.player3[i]}
            </button>
          </div>
        )
        rows.push(row);
      }
      else if(num === 4){
        const row = (
          <button onClick = {(i) => this.handleMove(4)}>
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

ReactDOM.render(
  <DehlaPakad />,
  document.getElementById('root')
);