import React from 'react';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

export default function SocialMediaButton({ user, signOut, signInWithFacebook, signInWithGoogle }) {
  return (
    <>
      {
        user
          ? <p style={{ color: '#fff' }}>Hello, { user.displayName }</p>
          : ''
      }

      {
        user
          ?
            <button onClick={signOut} style={{
              margin: "0 10px",
              padding: "15px",
              outline: "none",
              border: "none",
              borderRadius: "10px",
              transition: "0.2s",
              cursor: "pointer",
              height: "70px",
              width: "100px",
              fontSize: "100%",
              alignItems: "center"
            }}>
              Sign out
            </button>
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
