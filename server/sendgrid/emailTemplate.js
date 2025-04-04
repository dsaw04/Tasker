export const verificationEmailTemplate = (username, verificationToken) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');

      body {
        font-family: 'Lexend', Arial, sans-serif;
        line-height: 1.6;
        margin: 20px 20px;
        padding: 0;
        background-color: #f9f9f9;
        color: #000000; /* Default black text color */
      }
      .container {
        max-width: 600px;
        margin: 10px 20px;
        text-align: left; /* Default alignment for the text */
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #000000; /* Ensure header text is black */
      }
      .otp {
        display: inline-block;
        font-size: 28px;
        font-weight: bold;
        color: #000000; /* Ensure OTP text is black */
        margin: 20px auto;
        padding: 10px 20px; /* Add padding for slight spacing around the content */
        border-radius: 5px;
        background-color: #f7f7f7; /* Light gray background */
        text-align: center;
      }
      p {
        color: #000000; /* Ensure paragraph text is black */
      }
      .footer {
        font-size: 14px;
        color: #000000; /* Ensure footer text is black */
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Hello, ${username}!</div>
      <p>
        Thank you for signing up for Tasker. Use the OTP below to verify your
        email address:
      </p>
      <div style="text-align: center;">
        <!-- Center the OTP -->
        <div class="otp">${verificationToken}</div>
      </div>
      <p>
        This OTP is valid for 10 minutes. If you did not request this, please
        ignore this email.
      </p>
      <div class="footer">
        <p>Thank you for choosing Tasker!</p>
      </div>
    </div>
  </body>
</html>

    `;
};

export const resetEmailTemplate = (username, resetLink) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');

      body {
        font-family: 'Lexend', Arial, sans-serif;
        line-height: 1.6;
        margin: 20px 20px;
        padding: 0;
        background-color: #f9f9f9;
        color: #000000; /* Default black text color */
      }
      .container {
        max-width: 600px;
        margin: 10px 20px;
        text-align: left; /* Default alignment for the text */
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #000000; /* Ensure header text is black */
      }
      .button {
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        margin: 20px auto;
        padding: 10px 20px;
        border-radius: 5px;
        background-color: #436755; 
        text-align: center;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #A3B18A; /* Hover background color */
      }

      p {
        color: #000000; /* Ensure paragraph text is black */
      }
      .footer {
        font-size: 14px;
        color: #000000; /* Ensure footer text is black */
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Hello, ${username}!</div>
      <p>
        We received a request to reset your password for Tasker. If you made this request, click the link below to reset your password:
      </p>
      <div style="text-align: center;">
        <!-- Center the reset link button -->
        <a href="${resetLink}" class="button" style="color: #ffffff !important; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold; margin: 20px auto; padding: 10px 20px; border-radius: 5px; background-color: #436755;">Reset Password</a>
      </div>
      <p>
        If you did not request this, please ignore this email. Your password will remain unchanged.
      </p>
      <div class="footer">
        <p>Thank you for choosing Tasker!</p>
      </div>
    </div>
  </body>
</html>
  `;
};
