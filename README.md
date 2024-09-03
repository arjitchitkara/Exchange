
# Exchange Project

This project is designed to build an exchange system, divided into multiple parts. The project leverages various technologies including Kubernetes for orchestration and Docker for containerization.

## Project Structure

### Part 1
- **day-1**: Contains the tasks and code implemented on the first day of part 1.
- **day-2**: Contains the tasks and code implemented on the second day of part 1.

### Part 2
- **api**: Backend APIs for managing and retrieving exchange data.
- **db**: Database configuration and migration scripts.
- **docker**: Docker configuration files for containerizing the application.
- **engine**: Core engine logic for processing exchange transactions.
- **frontend**: Frontend code for the exchange UI.
- **mm**: Market-making algorithms and scripts.
- **ws**: WebSocket server for real-time exchange updates.

## Tech Stack

- **Backend**:
  - Node.js
  - Express.js
  - WebSocket (for real-time updates)
  - Docker (for containerization)
  - Kubernetes (for container orchestration)
  
- **Frontend**:
  - Next.js
  - Tailwind CSS
  
- **Database**:
  - PostgreSQL
  
- **Others**:
  - Docker: To containerize the application components for easy deployment.
  - ORM: Prisma
  - Kubernetes: For managing containerized applications in various environments.
  - Git: Version control system to manage the project's codebase.
  - Market Making Scripts: Python scripts for simulating and testing market-making strategies.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:
   ```bash
   cd exchange-project
   ```

3. **Setting up the backend**:
   - Navigate to the `part-2/api` directory.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

4. **Setting up the frontend**:
   - Navigate to the `part-2/frontend` directory.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

5. **Running the Docker containers**:
   - Navigate to the `part-2/docker` directory.
   - Build and run the containers:
     ```bash
     docker-compose up --build
     ```

6. **Deploying with Kubernetes**:
   - Ensure your Kubernetes cluster is up and running.
   - Deploy the application:
     ```bash
     kubectl apply -f part-2/k8s/
     ```

7. **Database Migrations**:
   - Navigate to the `part-2/db` directory.
   - Run migration scripts to set up the database schema.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
```
