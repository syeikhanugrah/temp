import React from 'react';
import {FacebookLoginButton, GoogleLoginButton} from 'react-social-login-buttons';

export default function SocialMediaButton({ user, signOut, signInWithFacebook, signInWithGoogle }) {
  return (
    <>
      {
        user
          ? <p style={{color: '#fff'}}>Hello, {user.displayName}</p>
          : ''
      }

      {
        user
          ? <button onClick={signOut}>Sign out</button>
          : (
            <>
              <FacebookLoginButton onClick={signInWithFacebook} />
              <GoogleLoginButton onClick={signInWithGoogle} />
            </>
          )
      }
    </>
  )
}
