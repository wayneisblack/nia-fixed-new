# Nia

Nia is an opportunities platform built to help African talent discover jobs,
internships, scholarships, and fellowships. People can create a talent or
employer account, build a profile, explore and save opportunities, and manage
applications. The app also includes employer-facing dashboard pages.

## Features

- Talent and employer registration, login, and authenticated sessions
- Profile setup and onboarding, including skills, interests, location, and experience
- Opportunity browsing, category filtering, search, and recommended opportunities
- Saved opportunities, application submission, and application tracking
- Account and profile management
- REST endpoints for accounts, profiles, opportunities, applications, bookmarks,
  and activity

## Technology

- **Web app:** Next.js App Router, React, and TypeScript
- **Authentication:** Auth.js credentials provider
- **API:** Java 17, Spring Boot 3.5, and Maven
- **Database:** MongoDB
- **Tests:** JUnit, Mockito, and Spring MockMvc

The web app is in the repository root. The Spring Boot REST API is in `backend/`.
The API follows a controller-service-data-access structure: controllers map HTTP
requests, services apply application rules, and repositories or `MongoTemplate`
access MongoDB.

## Requirements

- Node.js and npm
- Java 17 or later
- Maven
- MongoDB, local or hosted

## Configure environment

Create a root `.env.local` for the web app. Keep real credentials in this local
file and do not commit it.

```env
MONGODB_URI=mongodb://127.0.0.1:27017/nia
MONGODB_DB_NAME=nia
AUTH_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For MongoDB Atlas, use the connection string provided by Atlas for `MONGODB_URI`.
Configure network access and a database user in Atlas as required.

The backend reads its configuration from environment variables:

| Variable | Purpose | Default |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nia` |
| `MONGODB_DB_NAME` | Database name | `nia` |
| `JWT_SECRET` | Secret used to sign API JWTs; set a strong secret of at least 32 characters | Development placeholder |
| `FRONTEND_ORIGIN` | Allowed frontend origin for CORS | `http://localhost:3000` |
| `PORT` | Backend HTTP port | `8080` |

Set production secrets through your deployment environment; never commit real
secrets or connection strings.

## Run locally

Start the Spring Boot API in one terminal:

```powershell
cd backend
mvn spring-boot:run
```

Start the web app in a second terminal from the repository root:

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API listens on
[http://localhost:8080](http://localhost:8080) by default. You can check the
backend health endpoint at `GET http://localhost:8080/api/health`.

## Backend API overview

| Feature | Example endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Registration and login | `POST /api/register`, `POST /api/auth/login` |
| Profile | `PATCH /api/profile` |
| Opportunities | `GET /api/opportunities`, `GET /api/opportunities/{id}` |
| Applications | `GET /api/applications`, `POST /api/applications`, `POST /api/applications/{id}/cancel` |
| Bookmarks | `GET /api/bookmarks`, `POST /api/bookmarks` |
| Activity | `GET /api/me/activity` |
| Account | `PATCH /api/account/email`, `PATCH /api/account/password`, `DELETE /api/account` |

Authenticated API endpoints require a bearer token. See
[`backend/README.md`](backend/README.md) for the backend endpoint details and
architecture notes.

## Test and package the backend

Run these commands from `backend/`:

```powershell
mvn test
mvn clean install
```

`mvn clean install` compiles the backend, runs its tests, packages the executable
Spring Boot JAR, and installs the artifact in the local Maven repository. The
JAR is created at `backend/target/nia-backend-0.1.0.jar`.

You can also build without installing the artifact locally:

```powershell
mvn clean package
```

The backend tests use mocks and do not require a running MongoDB instance.

## Web app checks

Run these commands from the repository root:

```powershell
npm run lint
npm run build
```
