# BookTrade — Book Exchange Platform MVP

A full-stack web application where readers can discover books, manage their personal collection, request book exchanges via email, and administer users and listings.

---

## Tech Stack

- **Frontend (`client/`):** Next.js 15 (App Router), TypeScript, Tailwind CSS (Light Theme), TanStack Query (React Query), React Hook Form, Zod, Zustand, Axios, Lucide React, React Hot Toast
- **Backend (`server/`):** NestJS, TypeScript, Prisma ORM, PostgreSQL, Passport JWT, Bcrypt, Class Validator, Class Transformer, Nodemailer

---

## Project Structure

```text
fullstack-bookTrade/
├── client/                 # Next.js 15 frontend application (port 3000)
│   ├── app/                # App Router pages & layouts
│   ├── components/         # Reusable UI, Auth, Books, Profile & Admin components
│   ├── hooks/              # TanStack Query hooks
│   ├── lib/                # Axios client, Zod schemas, JWT & cookie utilities
│   ├── stores/             # Zustand auth store
│   └── middleware.ts       # Route protection middleware
└── server/                 # NestJS REST API (port 5000)
    ├── prisma/             # Prisma schema, migrations & admin seed script
    └── src/                # Modular NestJS architecture (Auth, Users, Books, Exchange, Profile, Admin, Mail, Prisma)
```

---

## Environment Variables Setup

### 1. Backend (`server/.env`)

Copy the example configuration file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Configure the variables in `server/.env`:

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Port the NestJS server listens on | `5000` |
| `CORS_ORIGIN` | Allowed frontend origin (also used for password-reset links) | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/book_exchange?schema=public` |
| `JWT_SECRET` | Secret key used to sign JWT tokens | `change-me-to-a-long-random-string` |
| `JWT_EXPIRES_IN_SECONDS` | JWT token lifetime in seconds | `3600` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port (`587` for STARTTLS, `465` for SSL) | `587` |
| `SMTP_USER` | SMTP account username / email address | `your-email@gmail.com` |
| `SMTP_PASSWORD` | SMTP password or Gmail App Password | `your-app-password` |
| `MAIL_FROM` | Sender address for outgoing emails | `"Book Exchange <your-email@gmail.com>"` |
| `ADMIN_EMAIL` | Initial admin email used by the seed script | `admin@bookexchange.test` |
| `ADMIN_PASSWORD` | Initial admin password used by the seed script | `ChangeMe123!` |
| `ADMIN_NAME` | Initial admin display name | `Administrator` |

### 2. Frontend (`client/.env.local`)

Copy the example configuration file in the `client/` directory:

```bash
cd client
cp .env.example .env.local
```

Configure the variable in `client/.env.local`:

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the NestJS backend API | `http://localhost:5000` |

---

## Getting Started

### Step 1: Start PostgreSQL & Run Backend (`server/`)

```bash
cd server

# Optional: start PostgreSQL via Docker Compose
docker compose up -d

# Install dependencies
npm install

# Generate Prisma Client & apply database migrations
npx prisma generate
npx prisma migrate deploy

# Seed the initial Administrator account
npm run prisma:seed

# Start the NestJS API in development watch mode (http://localhost:5000)
npm run start:dev
```

### Step 2: Start Frontend (`client/`)

Open a second terminal:

```bash
cd client

# Install dependencies
npm install

# Start the Next.js development server (http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## API Overview

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a new user account |
| `POST` | `/auth/login` | Public | Authenticate and receive a JWT |
| `POST` | `/auth/forgot-password` | Public | Send a password reset link via email |
| `POST` | `/auth/reset-password` | Public | Reset password using a valid token |
| `GET` | `/auth/me` | JWT | Get the authenticated user's profile |
| `GET` | `/books` | Public | Paginated, sorted, searchable list of books |
| `GET` | `/books/:id` | Public | Get details for a single book |
| `POST` | `/books/:id/exchange` | JWT | Create an exchange request & email the owner |
| `GET` | `/me/books` | JWT | List books owned by the current user |
| `POST` | `/me/books` | JWT | Add a book to the current user's collection |
| `DELETE` | `/me/books/:id` | JWT | Delete a book owned by the current user |
| `GET` | `/me/profile` | JWT | Get user profile, book count & incoming exchange requests |
| `PATCH` | `/me/profile` | JWT | Update name, email, or avatar URL |
| `GET` | `/admin/users` | Admin | List all registered users |
| `POST` | `/admin/users` | Admin | Create a user with a specified role |
| `POST` | `/admin/users/:userId/books` | Admin | Add a book on behalf of any user |
| `DELETE` | `/admin/books/:id` | Admin | Delete any book in the platform |

