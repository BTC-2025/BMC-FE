# Docker Integration Guide

This guide provides instructions on how to build, run, and maintain the Enterprise ERP system using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop).

## Services Overview

The system consists of four main services:

1.  **Frontend**: React + Vite application served via Nginx.
2.  **Backend**: FastAPI application.
3.  **Database**: PostgreSQL for persistent storage.
4.  **Cache**: Redis for high-performance caching.

## Getting Started

### 1. Build and Start Services

To build the images and start all services in the background, run:

```bash
docker-compose up --build -d
```

### 2. Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Verify System Health

You can check if the backend is correctly connected to the database and cache by visiting:
[http://localhost:8000/](http://localhost:8000/)

Expected response:

```json
{
  "status": "ERP Backend Running",
  "cache": "CONNECTED"
}
```

## Maintenance Commands

### Viewing Logs

To see the live logs for all services:

```bash
docker-compose logs -f
```

To see logs for a specific service (e.g., backend):

```bash
docker-compose logs -f backend
```

### Stopping Services

To stop all services:

```bash
docker-compose stop
```

To stop and remove containers (data in Postgres will be preserved in a volume):

```bash
docker-compose down
```

### Database Management

The PostgreSQL data is persisted in a Docker volume named `pgdata`. Even if you remove the containers, your data remains safe.

To wipe the database completely (WARNING: Destructive):

```bash
docker-compose down -v
```

## Environment Variables

Configuration is handled via environment variables in `docker-compose.yml`. Key variables include:

- `DATABASE_URL`: Connection string for PostgreSQL.
- `REDIS_HOST`: Hostname of the Redis service (`redis`).
- `VITE_API_URL`: URL used by the frontend to communicate with the backend.
