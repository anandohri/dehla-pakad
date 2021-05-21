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
                  isLoggedIn: false,
                  readyToStart: false};
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
        this.setState({readyToStart: true, cards: dataFromServer.cards});
      }
    }
  }

  render(){
    return(
      <div>
        {this.state.isLoggedIn ? 
          <div>
            {this.state.readyToStart ?
              <div>
                Details<br />
                UserID: {this.state.userId} <br />
                UserName: {this.state.userName} <br />
                Team: {this.state.team} <br />
                Cards: {this.state.cards}
              </div>
            : 'Waiting for other player to join.'}
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
  render(){
    return('test'.substring(0, 'test'.indexOf('s')));
  }
}

ReactDOM.render(
  <DehlaPakad />, document.getElementById('root')
);