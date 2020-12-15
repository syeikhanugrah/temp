import React from 'react';
import ReactDOM from 'react-dom';
import socket from './socket';
import Main from './components/Main';
import './css/index.css';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';


class App extends React.Component {
  constructor() {
    super();
    this.state = { client: socket() };
  }

  render() {
    return (
      <div className="root">
        <Main client={this.state.client} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
