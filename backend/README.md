# Nia Spring Boot backend

REST API for Nia (accounts, profiles, opportunities, applications, bookmarks), backed by MongoDB.
Java 17+, Spring Boot 3.5, Maven.

## Architecture

    HTTP request
        -> Controller   (maps the URL, reads JSON, returns JSON; no business logic)
        -> Service      (validation, rules, password hashing, JWT creation)
        -> Repository / MongoTemplate   (MongoDB)

| Feature     | Controller              | Service              | Endpoints |
|-------------|-------------------------|----------------------|-----------|
| health      | HealthController        | HealthService        | GET /api/health |
| register    | UserController          | UserService          | POST /api/register |
| login       | AuthController          | AuthService          | POST /api/auth/login |
| profile     | ProfileController       | ProfileService       | PATCH /api/profile |
| opportunity | OpportunityController   | OpportunityService   | GET /api/opportunities, GET /api/opportunities/{id} |
| application | ApplicationController   | ApplicationService   | GET, POST /api/applications, POST /api/applications/{id}/cancel |
| bookmark    | BookmarkController      | BookmarkService      | GET, POST /api/bookmarks |
| activity    | ActivityController      | ActivityService      | GET /api/me/activity |
| account     | AccountController       | AccountService       | PATCH /api/account/email, PATCH /api/account/password, DELETE /api/account |

Errors from services are `ApiException`s; `GlobalExceptionHandler` turns them into `{"error": "..."}` with the right status.
Everything except health, register, login and opportunities requires `Authorization: Bearer <JWT>`.

## Build, test, package

    mvn test              # run the unit tests only
    mvn clean install     # compile + run tests + build the JAR (target/nia-backend-0.1.0.jar)
    mvn clean package     # same, without installing into ~/.m2

The tests use Mockito and MockMvc, so they need no database and no network.

## Run

    mvn spring-boot:run
    # or, from the packaged JAR:
    java -jar target/nia-backend-0.1.0.jar

Environment variables:

| Variable          | Purpose                          | Default |
|-------------------|----------------------------------|---------|
| MONGODB_URI       | MongoDB connection string        | mongodb://localhost:27017/nia |
| MONGODB_DB_NAME   | database name                    | nia |
| JWT_SECRET        | HS256 signing key (32+ chars)    | development placeholder - always set your own |
| FRONTEND_ORIGIN   | allowed CORS origin(s), comma-separated | http://localhost:3000 |
| PORT              | HTTP port                        | 8080 |
