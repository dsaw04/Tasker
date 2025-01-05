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
