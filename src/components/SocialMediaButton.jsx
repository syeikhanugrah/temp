import React from 'react';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

export default function SocialMediaButton({ user, signOut, signInWithFacebook, signInWithGoogle }) {
  return (
    <>
      {
        user === null && (
          <>
            <FacebookLoginButton onClick={signInWithFacebook} />
            <GoogleLoginButton onClick={signInWithGoogle} />
          </>
        )
      }
    </>
  )
}
