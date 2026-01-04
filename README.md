# Task Management Application

A full-stack task management application built with modern technologies and best practices. This application demonstrates proficiency in backend API development (NestJS), frontend development (React), and database design (PostgreSQL/TypeORM).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Architecture](#architecture)

## ✨ Features

- **Task CRUD Operations**: Create, Read, Update, and Delete tasks
- **Task Filtering**: Filter tasks by status and priority
- **Search Functionality**: Search tasks by title
- **Sorting**: Server-side sorting by title, status, priority, or due date
- **Pagination**: Server-side pagination for task lists
- **Tabular View**: Clean table display with sortable columns
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Client-side (Zod) and server-side (class-validator) validation
- **Real-time Notifications**: Success and error feedback

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 11.x | Backend framework |
| TypeScript | 5.7.x | Programming language |
| PostgreSQL | 16.x | Database |
| TypeORM | 0.3.x | ORM |
| class-validator | 0.14.x | Request validation |
| class-transformer | 0.5.x | Data transformation |
| Swagger/OpenAPI | 11.x | API documentation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool |
| TypeScript | 5.9.x | Programming language |
| TanStack Router | 1.x | File-based routing |
| Tailwind CSS | 3.4.x | Styling |
| Shadcn UI | Latest | UI components |
| Zod | 3.x | Form validation |
| Zustand | 5.x | State management |

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: v22.16.0 or above
- **npm**: v10.x or above (comes with Node.js)
- **PostgreSQL**: v16.x (latest stable version)
- **Git**: For version control

Verify your installations:

```bash
node --version  # Should be v22.16.0 or higher
npm --version   # Should be v10.x or higher
psql --version  # Should be v16.x
```

## 📁 Project Structure

```
task-management-app/
├── backend/                    # NestJS Backend Application
│   ├── src/
│   │   ├── common/            # Shared utilities, filters, etc.
│   │   ├── config/            # Configuration files
│   │   ├── migrations/        # TypeORM migration files
│   │   └── modules/
│   │       └── tasks/
│   │           ├── apps/features/v1/   # Vertical slice features
│   │           │   ├── createTask/
│   │           │   ├── updateTask/
│   │           │   ├── removeTask/
│   │           │   ├── getTaskById/
│   │           │   └── getTasks/
│   │           └── domain/    # Entity definitions
│   ├── tests/                 # Unit tests
│   │   └── unit/services/
│   ├── docker-compose.yml     # PostgreSQL container config
│   └── package.json
├── frontend/                  # React Frontend Application
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── components/       # UI components
│   │   ├── contexts/         # React contexts (theme, notifications)
│   │   ├── features/         # Feature-specific components
│   │   ├── lib/              # Utilities
│   │   ├── routes/           # TanStack Router pages
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types
│   └── package.json
└── README.md                  # This file
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Environment Configuration

### Backend Configuration

1. Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```env
# Node Environment
NODE_ENV=development

# Server Configuration
PORT=3000

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=task_management

# TypeORM Configuration
DB_SYNCHRONIZE=false
DB_LOGGING=true
```

### Frontend Configuration

The frontend is pre-configured to connect to the backend at `http://localhost:3000`. If you need to change this, modify the `API_BASE_URL` in `frontend/src/lib/http.ts`.

## 🗄️ Database Setup

### Option 1: Using Docker (Recommended)

```bash
cd backend
docker-compose up -d
```

This will start a PostgreSQL container with:
- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Database**: task_management

### Option 2: Using Local PostgreSQL

1. Create the database:

```bash
createdb task_management
```

2. Update your `.env` file with your local PostgreSQL credentials.

### Running Migrations

After the database is set up, run the migrations:

```bash
cd backend
npm run build
npx typeorm migration:run -d dist/config/data-source.js
```

## 🏃 Running the Application

### Start the Backend

```bash
cd backend
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📖 API Documentation

### Swagger UI

Once the backend is running, access the interactive API documentation at:

**http://localhost:3000/api/docs**

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/tasks` | Create a new task |
| `GET` | `/api/v1/tasks` | List all tasks (with pagination, filtering) |
| `GET` | `/api/v1/tasks/:id` | Get a task by ID |
| `PUT` | `/api/v1/tasks/:id` | Update a task |
| `DELETE` | `/api/v1/tasks/:id` | Delete a task |

### Query Parameters (GET /api/v1/tasks)

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 10 |
| `status` | enum | Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED) | - |
| `priority` | enum | Filter by priority (LOW, MEDIUM, HIGH) | - |
| `search` | string | Search by title | - |
| `sortBy` | enum | Sort by field (title, status, priority, dueDate, createdAt) | createdAt |
| `sortOrder` | enum | Sort direction (asc, desc) | desc |

### Request/Response Examples

#### Create Task

```bash
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

## 🧪 Testing

### Backend Unit Tests

The backend uses Node.js built-in test runner (`node:test`) for unit testing.

```bash
cd backend
npm install tsx   # If not already installed
npm run test
```

#### Test Structure

```
tests/
└── unit/
    └── services/
        ├── createTask.service.test.ts
        ├── updateTask.service.test.ts
        ├── removeTask.service.test.ts
        ├── getTaskById.service.test.ts
        └── getTasks.service.test.ts
```

#### Test Coverage

Tests cover:
- ✅ Successful CRUD operations
- ✅ Validation failures
- ✅ Not found scenarios (404)
- ✅ Error handling
- ✅ Edge cases (null values, optional fields)

## 🏗 Architecture

### Backend: Vertical Slice Architecture

Each feature is organized as a complete vertical slice:

```
modules/tasks/apps/features/v1/{featureName}/
├── contract/index.ts     # Request/Response DTOs with validation
├── endpoint/index.ts     # Controller (HTTP handlers)
└── services/index.ts     # Business logic
```

This architecture provides:
- **High cohesion**: All code for a feature is in one place
- **Low coupling**: Features are independent
- **Easy navigation**: Clear structure for each operation
- **Testability**: Services can be tested in isolation

### Database Schema

**tasks** table:

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | UUID | PRIMARY KEY | Auto-generated |
| title | VARCHAR(255) | NOT NULL | - |
| description | TEXT | NULL | - |
| status | ENUM | NOT NULL | 'PENDING' |
| priority | ENUM | NULL | - |
| due_date | TIMESTAMP | NULL | - |
| created_at | TIMESTAMP | NOT NULL | Current timestamp |
| updated_at | TIMESTAMP | NOT NULL | Current timestamp |

**Indexes:**
- `idx_tasks_status` - For status filtering
- `idx_tasks_priority` - For priority filtering
- `idx_tasks_due_date` - For date-based queries

### Frontend Architecture

- **File-based Routing**: TanStack Router with auto-generated route tree
- **State Management**: Zustand for global state (tasks, loading, errors)
- **Component Library**: Shadcn UI with Tailwind CSS
- **Form Validation**: Zod schemas for type-safe validation

## 📝 Additional Notes

### Design Decisions

1. **UUID for Primary Keys**: Provides globally unique identifiers suitable for distributed systems
2. **ENUM Types**: Ensures data integrity for status and priority fields
3. **Vertical Slice Architecture**: Chosen for better feature isolation and maintainability
4. **Server-side Pagination**: Improves performance for large datasets

### Known Limitations

- The application currently supports single-user mode (no authentication)
- Due dates are stored in UTC


**Built with ❤️ using NestJS, React, and PostgreSQL**

