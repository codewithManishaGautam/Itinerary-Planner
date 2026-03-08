# Java Spring Boot Migration Guide

## Conversion Summary

Your Node.js/Express backend has been completely converted to Java Spring Boot while keeping your frontend unchanged.

## What's New

### Java Project Structure
```
├── pom.xml                          (Maven configuration)
├── src/main/java/com/tripplanner/api/
│   ├── TripPlannerApplication.java  (Spring Boot main class)
│   ├── controller/                  (API controllers)
│   ├── service/                     (Business logic)
│   ├── model/                       (Entity models)
│   ├── dto/                         (Data transfer objects)
│   ├── repository/                  (Data access layer)
│   ├── security/                    (JWT & authentication)
│   └── config/                      (Spring configuration)
├── src/main/resources/
│   ├── application.properties       (Dev config)
│   ├── application-prod.properties  (Prod config)
│   └── static/                      (Frontend files)
└── src/test/java/                   (Test files)
```

### Key Components

**Controllers** (`controller/`)
- `AuthController` - Handles login, signup, logout
- `ItineraryController` - Generates trip itineraries
- `StaticController` - Serves HTML pages

**Services** (`service/`)
- `AuthService` - Authentication logic
- `UserService` - User management
- `ItineraryService` - Itinerary generation with mock AI logic

**Models** (`model/`)
- `User` - JPA entity with id, email, password, name

**DTOs** (`dto/`)
- Request/Response objects for API communication
- Validation annotations for input validation

**Security** (`security/`)
- `JwtTokenProvider` - Token generation and validation
- `JwtAuthenticationFilter` - JWT authentication filter

**Repository** (`repository/`)
- `UserRepository` - Spring Data JPA interface for user persistence

## Running on Replit

### Step 1: Start the Server
Click the **Run** button to start the workflow. The workflow is configured to execute:
```bash
mvn clean spring-boot:run -DskipTests -q
```

### Step 2: Wait for Startup
The first run downloads Maven dependencies (1-2 minutes). Subsequent runs are faster.

You'll see:
```
BUILD SUCCESS
Server started on port 5000
```

### Step 3: Access the Application
- **Frontend**: `https://<replit-project>.replit.dev`
- **API Base**: `https://<replit-project>.replit.dev/api`
- **H2 Console**: `https://<replit-project>.replit.dev/h2-console` (dev only)

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Register new user |
| POST | `/api/login` | Login user (returns JWT token) |
| GET | `/*` | Serve static files (HTML, CSS, JS) |

### Protected (Require JWT Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get current user info |
| POST | `/api/generate-itinerary` | Generate trip itinerary |
| POST | `/api/logout` | Logout user |

## Authentication Flow

1. **Sign Up**
   ```bash
   POST /api/signup
   Body: {"name":"John", "email":"john@example.com", "password":"password123"}
   Response: User details (NO token)
   ```

2. **Login**
   ```bash
   POST /api/login
   Body: {"email":"john@example.com", "password":"password123"}
   Response: JWT token + user details
   ```

3. **Use Token**
   ```bash
   POST /api/generate-itinerary
   Header: Authorization: Bearer <YOUR_JWT_TOKEN>
   Body: {"destination":"Paris", "startDate":"2024-04-01", ...}
   ```

## Frontend Integration

Your frontend JavaScript already works with the new backend! The file `client/js/main.js` contains:
- Auth functions: `handleLogin()`, `handleSignup()`, `handleLogout()`
- API calls: `authFetch()`, `apiRequest()`
- No changes needed to frontend code

The APIs match exactly:
- `/api/signup` - Same request/response format
- `/api/login` - Same request/response format
- `/api/generate-itinerary` - Same request/response format

## Configuration

### Development (Default)
- Database: H2 in-memory (no setup needed)
- Debug: ON (see Spring Boot logs)
- CORS: Enabled for all origins

### Production
Set environment variables:
```
DATABASE_URL=jdbc:postgresql://hostname:5432/dbname
DB_USER=username
DB_PASSWORD=password
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
```

Then run with:
```bash
java -jar target/trip-planner-api-1.0.0.jar --spring.profiles.active=prod
```

## Building for Deployment

### Create JAR
```bash
mvn clean package -DskipTests
```

Output: `target/trip-planner-api-1.0.0.jar`

### Run JAR
```bash
java -jar target/trip-planner-api-1.0.0.jar
```

## Differences from Original Node.js Version

| Aspect | Node.js | Java |
|--------|---------|------|
| Server Framework | Express | Spring Boot |
| Language | TypeScript/JavaScript | Java 17 |
| Build Tool | npm | Maven |
| Database (Dev) | In-memory Map | H2 |
| Auth | Simple token Map | JWT |
| Validation | Zod | Spring Validation |
| Startup | Instant | 2-5 seconds |
| Cold Start | 100ms | 5-10 seconds |

## Performance Comparison

**Development Server**
- Node.js: Lighter weight, instant startup
- Spring Boot: Heavier, slower startup but better for production

**Production Build**
- Node.js: npm build → dist/ folder
- Spring Boot: Maven build → JAR file → easy deployment

**Runtime**
- Both: Same API performance and response times
- Spring Boot: Better for scaling and enterprise deployment

## Troubleshooting

### Maven Build Hangs
- Check internet (dependencies downloading)
- Increase memory: `export MAVEN_OPTS="-Xmx1024m"`
- Clear cache: `rm -rf ~/.m2/repository`

### Port 5000 Busy
```bash
lsof -ti:5000 | xargs kill -9
# Or change port in application.properties
```

### H2 Database Issues
- H2 resets on each startup (create-drop mode)
- Use PostgreSQL in production for persistence
- Access console at `/h2-console` for debugging

### JWT Token Errors
- Ensure "Bearer " prefix in Authorization header
- Token expires after 24 hours (configurable)
- Re-login to get new token

## Next Steps

1. ✅ Backend converted to Java Spring Boot
2. ✅ All endpoints working with JWT auth
3. ✅ Frontend unchanged (works as-is)
4. 📋 Customize JWT_SECRET for production
5. 📋 Set up PostgreSQL if needed
6. 📋 Deploy to Replit or cloud platform

## Resources

- Spring Boot Docs: https://spring.io/projects/spring-boot
- Spring Security: https://spring.io/projects/spring-security
- JWT in Java: https://tools.ietf.org/html/rfc7519
- Maven: https://maven.apache.org/

Enjoy your new Java Spring Boot backend!
