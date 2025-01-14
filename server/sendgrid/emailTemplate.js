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

export const dailyTasksTemplate = (username, tasks) => {
  const taskList = tasks
    .map(
      (task) => `
      <li style="margin-bottom: 10px; padding: 10px; background: #f7f7f7; border-radius: 5px;">
        <strong>${task.description || "Untitled Task"}</strong><br/>
        <span style="color: #555;">Due: ${
          task.date ? new Date(task.date).toLocaleString() : "Invalid Date"
        }</span><br/>
        <span style="color: #777;">${task.status || "No status provided"}</span>
      </li>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');

          body {
            font-family: 'Lexend', Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            font-size: 24px;
            color: #436755;
            margin-bottom: 20px;
          }
          ul {
            padding: 0;
            list-style: none;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #555;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Hello, ${username || "User"}!</div>
          <p>Here are your tasks for today:</p>
          <ul>
            ${taskList || "<p>No tasks for today!</p>"}
          </ul>
          <p>Make sure to complete them on time. Have a productive day!</p>
          <div class="footer">
            <p>Thank you for choosing Tasker!</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
