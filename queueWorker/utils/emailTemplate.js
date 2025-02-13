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
