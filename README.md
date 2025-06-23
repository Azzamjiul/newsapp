# Newsapp Backend Service

This is the backend service for Newsapp, a news aggregation and delivery platform.

## Architecture Overview

The backend is built with a microservices-inspired architecture, utilizing several key components to deliver a scalable and reliable service.

### Crawler & Scrapper

- **Crawler:** A component that systematically browses websites (e.g., news sources) to find new content.
- **Scrapper:** Extracts relevant information (articles, headlines, etc.) from the crawled web pages. The service is designed to be extensible, with a dedicated scrapper for each news source (e.g., `abcnews.scrapper.service.ts`).

### Message Broker (RabbitMQ)

- We use RabbitMQ as a message broker to decouple the crawling/scraping process from the main application logic. When new news URLs are found, they are published to a queue.

### Consumer

- A dedicated consumer process listens for messages on the RabbitMQ queue. When a new URL is received, the consumer triggers the scrapper to extract the news content and store it in the database. This allows for asynchronous processing and improves the application's resilience.

### Cursor Pagination for Infinite Loading

- The news feed API uses cursor-based pagination to efficiently load articles for infinite scrolling on the client-side. This provides a seamless user experience without the performance overhead of traditional offset-based pagination.

### Authentication and Security

- **Auth Middleware & JWT:** User authentication is handled using JSON Web Tokens (JWT). A custom authentication middleware verifies the JWT on protected routes, ensuring that only authenticated users can access their data.

### Push Notifications (FCM)

- **FCM Integration:** Firebase Cloud Messaging (FCM) is integrated to send push notifications to users when new articles are published.
- **User Device Token Management:** The service manages user device tokens, allowing for targeted notifications to specific devices.

### API Documentation (Swagger)

- **OpenAPI Documentation:** The API is documented using Swagger, providing a clear and interactive API contract for frontend developers.

### Deployment

- The application is containerized using Docker and can be deployed to any Virtual Private Server (VPS) using Docker Compose. This ensures a consistent and reproducible deployment environment.

## Getting Started

### Prerequisites

- Node.js
- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory and add the necessary configuration (e.g., database credentials, JWT secret, etc.).
4. Run database migrations:
   ```bash
   npm run migrations
   ```
5. Start the application:
   ```bash
   docker-compose up -d
   ```

The application will be accessible at `http://localhost:4000`.
