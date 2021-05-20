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
                  isLoggedIn: false,
                  readyToStart: false};
  }

  handleUName = (e) => {
    this.setState({userName: e.target.value});
  }

  handleLogin = (val) => {
    if(this.state.userName != ''){
      client.send(JSON.stringify({
        type: 'login',
        userName: val
      }));
    }
    else{
      alert('Enter Username');
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
      else if(dataFromServer.type === 'failed'){
        alert('Room Full');
      }
      else if(dataFromServer.type === 'ready'){
        this.setState({readyToStart: true});
      }
    }
  }

  render(){
    return(
      <div>
        {this.state.isLoggedIn ? 
          <div>
              Details<br />
              UserID: {this.state.userId} <br />
              UserName: {this.state.userName}
          </div>
          : <div>
              <p className = 'header'>Delha Pakad</p>
              <br />
              <input className = 'userName' placeholder = 'Enter Username' onChange = {this.handleUName} />
              <button className = 'login' onClick = {() => this.handleLogin(this.state.userName)}>
                Login
              </button>
            </div>
        }
      </div>
    )
  }
}

class Test extends React.Component{
  render(){
    return('Testing');
  }
}

ReactDOM.render(
  <DehlaPakad />, document.getElementById('root')
);