# Book Exchange API

NestJS + Prisma + PostgreSQL REST API for exchanging books.

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

`SMTP_USER` and `SMTP_PASSWORD` may be left empty: an Ethereal test account is then generated on the first exchange request and the message preview URL is written to the application log.

`npm run prisma:seed` creates the first administrator from `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME`.

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/books?page=&limit=&search=` | Public |
| GET | `/books/:id` | Public |
| GET | `/me/books` | JWT |
| POST | `/me/books` | JWT |
| DELETE | `/me/books/:id` | JWT (owner or admin) |
| POST | `/books/:id/exchange` | JWT |
| GET | `/admin/users` | Admin |
| POST | `/admin/users` | Admin |
| DELETE | `/admin/books/:id` | Admin |

## Scripts

- `npm run start:dev` starts the API in watch mode
- `npm run build` compiles to `dist`
- `npm test` runs the unit tests

