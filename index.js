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
    this.state = {player1: this.setPlayer1(),
                  player2: this.setPlayer2(),
                  player3: this.setPlayer3(),
                  player4: this.setPlayer4(),
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
  
  setPlayer1 = () => {
    const arr = []
    for(let i = 0; i < 52; i = i + 4){
      arr.push(deck[i]);
    }
    return arr;
  }
  
  setPlayer2 = () => {
    let arr = []
    for(let i = 1; i < 52; i = i + 4){
      arr.push(deck[i]);
    }
    return arr;
  }
  
  setPlayer3 = () => {
    let arr = []
    for(let i = 2; i < 52; i = i + 4){
      arr.push(deck[i]);
    }
    return arr;
  }
  
  setPlayer4 = () => {
    let arr = []
    for(let i = 3; i < 52; i = i + 4){
      arr.push(deck[i]);
    }
    return arr;
  }

  render(){
    return(
      <div>
        <div className = 'player1'>
          Player1
        </div>
        <div className = 'player2'>
          Player2
        </div>     
        <div className = 'board' >
          Board
        </div>
        <div className = 'player3'>
          Player3
        </div>
        <div className = 'player4'>
          Player4
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <DehlaPakad />,
  document.getElementById('root')
);