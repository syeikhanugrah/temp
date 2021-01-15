import React, { Component } from 'react';

import SocialMediaButton from './SocialMediaButton';
import './../css/Buttons.css';

export default class Buttons extends Component {
  render() {
    const { user, signInWithFacebook, signInWithGoogle, signOut } = this.props;
    return (
      <div className="left">
        <div className="buttons">
          {user ? (
            <>
              <button
                className="start"
                style={{ backgroundColor: this.props.searching || this.props.connected ? '#fd4545' : '#51fd6d' }}
                onClick={this.props.start}
              >
                {this.props.searching || this.props.connected ? 'Stop' : 'Start'}
              </button>
              {(this.props.connected || this.props.disconnected) && (
                <button className="next" onClick={this.props.next}>
                  Skip
                </button>
              )}
              <button onClick={signOut}>
                Sign out
              </button>
            </>
          ) : ''}
        </div>
        <div style={{ textAlign: "center" }}>
          <SocialMediaButton user={user} signInWithFacebook={signInWithFacebook} signInWithGoogle={signInWithGoogle} signOut={signOut} />
        </div>
        <span>
          connected:
          <div className="circle" style={{ backgroundColor: this.props.connected ? '#51fd6d' : '#fd4545' }}></div>
        </span>
      </div>
    );
  }
}
