import * as React from 'react';

interface EmailTemplateProps{
  username: string;
  otp: string;
}

export default function EmailTemplate({ username, otp }: EmailTemplateProps){
  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>
        Thank you for signing up for our service. We hope you will enjoy using it!
      </p>
      <p>Please use the following verification code to complete your registration :</p>
      <p>{otp}</p>

    </div>
  );
}
