import React from 'react';
import firebase from 'firebase/app';
import "firebase/analytics";
import 'firebase/auth';
import withFirebaseAuth from 'react-with-firebase-auth';

import Main from './components/Main';
import firebaseConfig from './firebaseConfig';
import socket from './socket';
import './css/index.css';

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { client: socket() };
  }

  render() {
    const {
      user,
      signOut,
      signInWithGoogle,
      signInWithFacebook
    } = this.props;

    console.log(this.props);

    return (
      <div className="root">

        <Main client={this.state.client}
              user={user}
              signInWithFacebook={signInWithFacebook}
              signInWithGoogle={signInWithGoogle}
              signOut={signOut} />
      </div>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider(),
};

export default withFirebaseAuth({ providers, firebaseAppAuth })(App);
