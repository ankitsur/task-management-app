# Task Management Application

A full-stack task management application built with modern technologies and best practices. This application demonstrates proficiency in backend API development (NestJS), frontend development (React), and database design (PostgreSQL/TypeORM).

🔗 **Repository**: [https://github.com/ankitsur/task-management-app](https://github.com/ankitsur/task-management-app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [User Guide](#user-guide)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Architecture](#architecture)
- [Additional Notes](#additional-notes)

---

## 🌟 Overview

The Task Management Application is a productivity tool that helps you organize, track, and manage your tasks efficiently. Whether you're managing personal to-dos or project tasks, this application provides a clean and intuitive interface to:

- **Create tasks** with titles, descriptions, priorities, and due dates
- **Organize tasks** by status (Pending, In Progress, Completed, Cancelled)
- **Find tasks quickly** using search, filters, and sorting
- **Track progress** with visual status indicators
- **Work comfortably** in light or dark mode

The application is built as a full-stack solution with a React frontend and NestJS backend, connected to a PostgreSQL database.

---

## 📖 User Guide

### Getting Started

When you open the application, you'll see the **Task List** page displaying all your tasks in a clean table format.

### Creating a New Task

1. Click the **"+ New Task"** button in the **top-right corner** of the header
2. Fill in the task details:
   - **Title** (required): A short, descriptive name for your task
   - **Description** (optional): Additional details about the task
   - **Status**: Current state of the task (defaults to "Pending")
   - **Priority** (optional): Low, Medium, or High
   - **Due Date** (optional): When the task should be completed
3. Click **"Create Task"** to save

### Viewing Tasks

The main page displays all your tasks in a **table format** with the following columns:

| Column | Description |
|--------|-------------|
| **Title** | Task name (click to view details) |
| **Description** | Task description (truncated; hover to see full text) |
| **Status** | Color-coded badge showing task state |
| **Priority** | Color-coded badge showing importance level |
| **Due Date** | When the task is due (shows relative dates like "In 3 days") |

### Sorting Tasks

Click on any **column header** to sort tasks:

- **Title** - Click to sort alphabetically (A→Z or Z→A)
- **Status** - Click to group by status
- **Priority** - Click to sort by importance (Low→High or High→Low)
- **Due Date** - Click to sort by due date

An **arrow indicator (↑ or ↓)** shows the current sort direction. The sort indicator also appears below the task count (e.g., "Sorted by status (↑)").

### Filtering Tasks

Use the filter dropdowns to narrow down your task list:

- **Status Filter**: Show only Pending, In Progress, Completed, or Cancelled tasks
- **Priority Filter**: Show only Low, Medium, or High priority tasks
- **Search Box**: Type to search tasks by title

### Viewing Task Details

Click on any **task title** in the table to open the **Task Detail** page, which shows:

- Full task information
- Created and last updated timestamps
- **Edit** button to modify the task
- **Delete** button to remove the task

### Editing a Task

1. Click on a task title to open the detail page
2. Click the **"Edit"** button
3. Modify any fields as needed
4. Click **"Save Changes"** to update

### Deleting a Task

1. Click on a task title to open the detail page
2. Click the **"Delete"** button
3. Confirm the deletion in the dialog that appears

### Changing Themes

Click the **moon/sun icon** in the top-right corner to toggle between:

- ☀️ **Light Mode** - Clean, bright interface
- 🌙 **Dark Mode** - Easy on the eyes in low-light conditions

Your preference is saved automatically.

### Pagination

If you have many tasks, use the **pagination controls** at the bottom of the table:

- Navigate between pages using the page numbers
- Change items per page using the **"Per page"** dropdown (5, 10, 20, or 50)

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Create Tasks** | Add new tasks with title, description, status, priority, and due date |
| **View Tasks** | See all tasks in a clean, sortable table format |
| **Update Tasks** | Edit any task field at any time |
| **Delete Tasks** | Remove tasks you no longer need |
| **Task Details** | View full task information on a dedicated page |

### Advanced Features

| Feature | Description |
|---------|-------------|
| **Search** | Find tasks by typing in the search box |
| **Filter by Status** | Show only tasks with a specific status |
| **Filter by Priority** | Show only tasks with a specific priority |
| **Server-side Sorting** | Sort by title, status, priority, or due date |
| **Pagination** | Navigate through large task lists efficiently |
| **Dark/Light Theme** | Choose your preferred color scheme |

### UX Features

| Feature | Description |
|---------|-------------|
| **Responsive Design** | Works on desktop, tablet, and mobile |
| **Loading States** | Visual feedback during data operations |
| **Toast Notifications** | Success and error messages |
| **Form Validation** | Real-time validation with helpful error messages |
| **Confirmation Dialogs** | Prevent accidental deletions |
| **Tooltip on Hover** | See full description by hovering over truncated text |

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 11.x | Backend framework with dependency injection |
| TypeScript | 5.7.x | Type-safe programming language |
| PostgreSQL | 16.x | Relational database |
| TypeORM | 0.3.x | Object-Relational Mapping |
| class-validator | 0.14.x | Request validation decorators |
| class-transformer | 0.5.x | Data transformation |
| Swagger/OpenAPI | 11.x | API documentation |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| Vite | 7.x | Fast build tool and dev server |
| TypeScript | 5.9.x | Type-safe programming |
| TanStack Router | 1.x | File-based routing |
| Tailwind CSS | 3.4.x | Utility-first CSS framework |
| Shadcn UI | Latest | Beautiful, accessible UI components |
| Zod | 3.x | Schema validation |
| Zustand | 5.x | Lightweight state management |

---

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: v22.16.0 or above
- **npm**: v10.x or above (comes with Node.js)
- **PostgreSQL**: v16.x (latest stable version)
- **Git**: For version control
- **Docker** (optional): For running PostgreSQL in a container

Verify your installations:

```bash
node --version  # Should be v22.16.0 or higher
npm --version   # Should be v10.x or higher
psql --version  # Should be v16.x
```

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ankitsur/task-management-app.git
cd task-management-app

# 2. Start PostgreSQL (using Docker)
cd backend
docker-compose up -d

# 3. Setup backend
cp .env.example .env
npm install
npm run build
npx typeorm migration:run -d dist/config/data-source.js
npm run start:dev

# 4. Setup frontend (in a new terminal)
cd frontend
npm install
npm run dev

# 5. Open the app
# Visit http://localhost:5173 in your browser
```

---

## 📁 Project Structure

```
task-management-app/
├── backend/                         # NestJS Backend Application
│   ├── src/
│   │   ├── common/                  # Shared utilities
│   │   │   └── filters/             # Exception filters
│   │   ├── config/                  # Configuration files
│   │   │   ├── data-source.ts       # TypeORM data source
│   │   │   ├── database.config.ts   # Database configuration
│   │   │   └── env.config.ts        # Environment variables
│   │   ├── migrations/              # Database migrations
│   │   └── modules/
│   │       └── tasks/
│   │           ├── apps/features/v1/    # Vertical slice architecture
│   │           │   ├── createTask/      # POST /api/v1/tasks
│   │           │   ├── getTasks/        # GET /api/v1/tasks
│   │           │   ├── getTaskById/     # GET /api/v1/tasks/:id
│   │           │   ├── updateTask/      # PUT /api/v1/tasks/:id
│   │           │   └── removeTask/      # DELETE /api/v1/tasks/:id
│   │           └── domain/              # Entity definitions
│   ├── tests/                       # Unit tests
│   │   └── unit/services/           # Service tests
│   ├── docker-compose.yml           # PostgreSQL container
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── frontend/                        # React Frontend Application
│   ├── public/
│   │   └── favicon.svg              # App icon
│   ├── src/
│   │   ├── api/                     # API client functions
│   │   │   └── tasks.api.ts         # Task API calls
│   │   ├── components/              # Reusable components
│   │   │   ├── ui/                  # Shadcn UI components
│   │   │   ├── confirmation-dialog.tsx
│   │   │   ├── notification-container.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── contexts/                # React contexts
│   │   │   ├── notification.context.tsx
│   │   │   └── theme.context.tsx
│   │   ├── features/                # Feature modules
│   │   │   └── tasks/
│   │   │       ├── forms/           # Task forms
│   │   │       └── schemas/         # Zod validation schemas
│   │   ├── lib/                     # Utilities
│   │   ├── routes/                  # Page components
│   │   │   ├── __root.tsx           # Root layout
│   │   │   ├── index.tsx            # Task list page
│   │   │   └── tasks/
│   │   │       ├── new.tsx          # Create task page
│   │   │       ├── $id.tsx          # Task detail page
│   │   │       └── $id.edit.tsx     # Edit task page
│   │   ├── store/                   # Zustand stores
│   │   ├── styles/                  # CSS styles
│   │   └── types/                   # TypeScript types
│   └── package.json
│
├── README.md                        # This file
└── .gitignore
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ankitsur/task-management-app.git
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

---

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

---

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

---

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

---

## 📖 API Documentation

### Swagger UI

Once the backend is running, access the interactive API documentation at:

**http://localhost:3000/api/docs**

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/tasks` | Create a new task |
| `GET` | `/api/v1/tasks` | List all tasks (with pagination, filtering, sorting) |
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

```http
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

**Response (201 Created):**
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

#### Get Tasks with Filtering and Sorting

```http
GET /api/v1/tasks?status=PENDING&priority=HIGH&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Urgent task",
      "description": "This needs to be done ASAP",
      "status": "PENDING",
      "priority": "HIGH",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

---

## 🧪 Testing

### Backend Unit Tests

The backend uses Node.js built-in test runner (`node:test`) for unit testing.

```bash
cd backend
npm run test
```

**Expected Output:**
```
# tests 54
# pass 54
# fail 0
```

#### Test Structure

```
tests/
└── unit/
    └── services/
        ├── createTask.service.test.ts    # 8 tests
        ├── updateTask.service.test.ts    # 11 tests
        ├── removeTask.service.test.ts    # 9 tests
        ├── getTaskById.service.test.ts   # 10 tests
        └── getTasks.service.test.ts      # 16 tests
```

#### Test Coverage

Tests cover:
- ✅ Successful CRUD operations
- ✅ Validation failures
- ✅ Not found scenarios (404)
- ✅ Error handling
- ✅ Edge cases (null values, optional fields)
- ✅ Pagination and filtering
- ✅ Sorting logic

---

## 🏗 Architecture

### Backend: Vertical Slice Architecture

Each feature is organized as a complete vertical slice containing all layers needed for that feature:

```
modules/tasks/apps/features/v1/{featureName}/
├── contract/index.ts     # Request/Response DTOs with validation decorators
├── endpoint/index.ts     # Controller handling HTTP requests
└── services/index.ts     # Business logic and database operations
```

**Benefits:**
- **High cohesion**: All code for a feature is in one place
- **Low coupling**: Features are independent and can be modified in isolation
- **Easy navigation**: Clear, predictable structure
- **Testability**: Services can be unit tested independently

### Database Schema

**tasks** table:

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated | Unique identifier |
| title | VARCHAR(255) | NOT NULL | - | Task title |
| description | TEXT | NULL | - | Task description |
| status | ENUM | NOT NULL | 'PENDING' | PENDING, IN_PROGRESS, COMPLETED, CANCELLED |
| priority | ENUM | NULL | - | LOW, MEDIUM, HIGH |
| due_date | TIMESTAMP | NULL | - | Task due date |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_tasks_status` - For status filtering
- `idx_tasks_priority` - For priority filtering
- `idx_tasks_due_date` - For date-based queries

### Frontend Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Routing** | TanStack Router | File-based routing with auto-generated route tree |
| **State** | Zustand | Lightweight global state for tasks, loading, errors |
| **UI** | Shadcn UI + Tailwind | Beautiful, accessible components with utility-first CSS |
| **Validation** | Zod | Type-safe schema validation for forms |
| **API** | Custom HTTP client | Typed API calls with error handling |

---

## 📝 Additional Notes

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **UUID Primary Keys** | Globally unique, suitable for distributed systems, doesn't expose sequential information |
| **ENUM Types** | Ensures data integrity at the database level for status and priority |
| **Vertical Slice Architecture** | Better feature isolation, easier to understand and maintain |
| **Server-side Pagination & Sorting** | Improves performance for large datasets |
| **Zustand over Redux** | Simpler API, less boilerplate, sufficient for this use case |
| **TanStack Router** | Type-safe, file-based routing with excellent DX |

### Known Limitations

- Single-user mode (no authentication)
- Due dates are stored in UTC
- No task attachments or file uploads
- No task assignment or collaboration features

### Future Enhancements

- User authentication and authorization
- Task categories/tags
- Recurring tasks
- Email notifications
- Task comments
- Dashboard analytics

---


🔗 **GitHub**: [https://github.com/ankitsur/task-management-app](https://github.com/ankitsur/task-management-app)
