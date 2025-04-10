# Tasker

Tasker is a task management and productivity application designed to help users efficiently organize their tasks and improve daily productivity. It features user authentication, task CRUD operations, automated email reminders, and background workers for maintenance and email notifications.

## Features

- User Authentication: Secure user registration and login with JWT-based authentication.

- Task Management: Create, update, delete, and manage tasks with deadlines and priorities.

- Automated Email Notifications: Daily email reminders for pending tasks.

- Background Workers:

  - Cleanup Worker: Periodically removes inactive users and outdated data.

  - Email Worker: Queues and processes task reminder emails.

  - Scalable and Modular Architecture: Backend is structured for maintainability and scalability.

- Fully Dockerized Deployment: Uses Docker and Render for seamless deployment.

## Tech Stack

### Backend

- Node.js with Express.js

- MongoDB with Mongoose

- JWT for authentication

- RabbitMQ for task queuing

- SendGrid for email notifications

### Frontend

- React with TypeScript

- Tailwind CSS for styling

- Deployment & CI/CD

- Docker for containerized development

- Render for hosting

- GitHub Actions for CI/CD pipeline

## Project Structure

```plaintext
Tasker/
├── client/                 # Frontend (React)
│   ├── public/             # Static assets
│   ├── src/                # Application source code
├── server/                 # Backend (Node.js)
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Authentication & security
│   ├── backgroundWorkers/  # Async processing
│   │   ├── cronWorker/     # Scheduled cleanup jobs
│   │   ├── queueWorker/    # Email queue processing
│   ├── shared/             # Shared utilities (RabbitMQ, Email, etc.)
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Docker configuration
```

## Using Tasker

Tasker is live! Get started by visiting [Tasker](https://taskrapp.org). If the server takes a moment to wake up, hang tight—it’ll be ready soon!

### Steps to use:
#### Start by logging in, or creating an account if you are new.
![image](https://github.com/user-attachments/assets/3b515446-e002-46a7-a278-47e6a1c46b46)
#### Click on the + to add your first task
![image](https://github.com/user-attachments/assets/e6680004-60d3-4101-b62a-1022e067db95)
#### Click on the following buttons to 'Mark Done', 'Update' or 'Delete' a task respectfully
![image](https://github.com/user-attachments/assets/c787db4b-17fd-4f34-bb71-dd23547b5dd1)
#### Clicking on the dates when a task is available on the calendar filters the task for that specific day
![image](https://github.com/user-attachments/assets/26352f29-3be0-48d8-a43e-694fb2252689)
#### Marking a task as done increments your streak. Stay on top of your tasks, and keep that streak going!
![image](https://github.com/user-attachments/assets/5e4a6291-3655-463d-bf9e-7e235550a73e)

## Next Version

In the next version, I plan to introduce:
- Dark Mode
- Improved Analytics: Gain insights into productivity trends.
- Mobile Responsive Support: Access Tasker on mobile devices.

### Stay tuned for more news! 
### - Dhruv
