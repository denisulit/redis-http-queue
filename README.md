# Redis HTTP Queue

This project is a basic queuing system using Redis, TypeScript, and Express. It allows you to add tasks to a queue and process them asynchronously.

Warning: This won't be kept up to date and I am just publishing this for a project I am making.

## Features

- Add tasks to the queue via an API endpoint
- Process queued tasks using Axios for HTTP requests
- Use environment variables for configuration
- Strongly-typed environment variables using Zod

## Prerequisites

- Node.js
- pnpm
- Redis

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/denisulit/redis-http-queue
   cd redis-http-queue
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root of the project and add the following:

   ```env
   REDIS_URL=redis://localhost:6379
   QUEUE_PASSWORD=your_password_here
   PORT=3000
   QUEUE_TIMEOUT=30000
   REQUEUE_DELAY=30000
   ```

## Running the Project

1. Compile the TypeScript code:

   ```bash
   pnpm exec tsc
   ```

2. Start the server:

   ```bash
   node dist/index.js
   ```

## API Endpoints

### Add to Queue

- **URL**: `/queue`
- **Method**: `POST`
- **Body**:

  ```json
  {
    "id": "unique_task_id",
    "url": "http://example.com/api",
    "options": {
      "method": "GET",
      "headers": {
        "Authorization": "Bearer token"
      }
    },
    "password": "your_password_here"
  }
  ```

- **Responses**:
  - `200 OK`: Task added to queue
  - `400 Bad Request`: Missing required fields
  - `401 Unauthorized`: Incorrect password

## Contributing

Feel free to submit issues or pull requests if you have any improvements or fixes.

## License

This project is licensed under the MIT License.
