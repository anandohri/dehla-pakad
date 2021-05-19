import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

const client = new W3CWebsocket ('ws://192.168.0.199:8000');


class DehlaPakad extends React.Component{
  constructor(props){
    super(props);
    this.state = {userId: 0,
                  userName: '',
                  isLoggedIn: false,
                  readyToStart: false};
  }

  handleLogin = (val) => {
    client.send(JSON.stringify({
      type: 'login',
      userName: val
    }));
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
      <button onClick = {() => this.handleLogin(this.state.userName)}>
        Login
      </button>
    )
  }
}

ReactDOM.render(
  <DehlaPakad />, document.getElementById('root')
);