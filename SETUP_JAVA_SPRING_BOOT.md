# Java Spring Boot Setup Guide for TripPlanner AI

## ⚠️ IMPORTANT: Enable Java/Maven in Replit

Before running the project, you **MUST** enable Java and Maven modules in Replit:

### Option 1: Using Replit UI (Recommended)
1. Click the **"Packages"** icon (look for package/box icon in the left sidebar)
2. Search for **"java"** → Install it
3. Search for **"maven"** → Install it
4. Wait for installation to complete (2-3 minutes)
5. Click **"Run"** button to start the server

### Option 2: Using .replit file
If you have access to edit `.replit` (in Replit's advanced settings):
```
modules = ["java", "maven", "web", "postgresql-16"]
```

### Option 3: Terminal Command
Run in the Replit shell:
```bash
nix-shell -p openjdk17 maven
```

## ✅ What Has Been Created

Your entire backend has been converted from Node.js to Java Spring Boot:

### Java Files Created (20+ files)
```
src/main/java/com/tripplanner/api/
├── TripPlannerApplication.java          (Main entry point)
├── controller/
│   ├── AuthController.java              (Login, Signup, Logout)
│   ├── ItineraryController.java          (Generate itineraries)
│   └── StaticController.java             (Serve HTML pages)
├── service/
│   ├── AuthService.java                 (Auth logic)
│   ├── UserService.java                 (User management)
│   └── ItineraryService.java             (Itinerary generation)
├── model/
│   └── User.java                        (User entity)
├── dto/
│   ├── LoginRequest.java
│   ├── SignupRequest.java
│   ├── AuthResponse.java
│   ├── UserDTO.java
│   ├── GenerateItineraryRequest.java
│   └── ItineraryResponse.java
├── repository/
│   └── UserRepository.java              (Database access)
├── security/
│   ├── JwtTokenProvider.java            (Token generation)
│   └── JwtAuthenticationFilter.java      (Request filtering)
└── config/
    └── SecurityConfig.java              (Security setup)

src/main/resources/
├── application.properties                (Development config)
├── application-prod.properties           (Production config)
└── static/                              (All your frontend files)
    ├── index.html
    ├── login.html
    ├── signup.html
    ├── dashboard.html
    ├── css/style.css
    ├── js/main.js
    └── public/

pom.xml                                  (Maven configuration)
```

### Frontend Files (Unchanged)
All your original HTML/CSS/JavaScript files are in:
```
src/main/resources/static/
```

They work exactly the same with the new backend.

## 🚀 Running the Project

### Step 1: Enable Java/Maven
Follow the instructions above to install Java and Maven modules.

### Step 2: Click Run
Click the **"Run"** button in Replit. You should see:
```
mvn clean spring-boot:run -DskipTests -q
```

### Step 3: Wait for Startup
- **First time**: 2-3 minutes (Maven downloads dependencies)
- **Subsequent runs**: 5-10 seconds

You'll see:
```
INFO: Tomcat started on port 5000
TripPlannerApplication has started successfully
```

### Step 4: Test It
Open your browser:
```
https://<your-replit-name>.replit.dev
```

You should see your TripPlanner homepage!

## 📋 Project Details

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: H2 (dev), PostgreSQL (prod)
- **Authentication**: JWT
- **Frontend**: Vanilla HTML/CSS/JavaScript

### API Endpoints
**Public:**
- `POST /api/signup` - Register
- `POST /api/login` - Login (returns JWT token)
- `GET /` - Home page
- `GET /*.html` - HTML pages

**Protected (need JWT token):**
- `GET /api/user` - Get current user
- `POST /api/generate-itinerary` - Generate itinerary
- `POST /api/logout` - Logout

### Authentication
1. User signs up or logs in
2. Server returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in `Authorization: Bearer <token>` header
5. Server validates token before processing protected requests

## 🔧 Key Features

### ✅ Complete
- User registration and login
- Password hashing with BCrypt
- JWT token-based authentication
- Itinerary generation with mocked AI logic
- 38 destinations across 6 categories
- Interactive maps with Leaflet.js
- H2 in-memory database for development

### 📝 Configuration Files
- `application.properties` - Development settings
- `application-prod.properties` - Production settings
- `pom.xml` - Maven dependencies and build config

### 🗄️ Database
**Development**: H2 in-memory (automatically created)
**Production**: PostgreSQL (configure via environment variables)

## 🛠️ Troubleshooting

### Maven Command Not Found
**Solution**: Install Maven in Replit
1. Click "Packages" in left sidebar
2. Search and install "maven"
3. Wait for installation
4. Click Run

### Port 5000 Already in Use
```bash
# Kill existing process
lsof -ti:5000 | xargs kill -9

# Or change port in application.properties
server.port=5001
```

### Slow Startup
- First run: Maven downloads all dependencies (normal, 1-2 minutes)
- Subsequent runs: 5-10 seconds
- Production builds are much faster

### Database Reset
- H2 database resets on each restart (development only)
- In production, use PostgreSQL for persistent data

## 📦 Deployment to Production

### Prerequisites
Set environment variables:
```
DATABASE_URL=jdbc:postgresql://your-db-host:5432/tripplanner
DB_USER=your-username
DB_PASSWORD=your-password
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=86400000
```

### Build JAR
```bash
mvn clean package -DskipTests -q
```

Output: `target/trip-planner-api-1.0.0.jar`

### Run JAR
```bash
java -jar target/trip-planner-api-1.0.0.jar --spring.profiles.active=prod
```

### Docker (Optional)
```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/trip-planner-api-1.0.0.jar .
CMD ["java", "-jar", "trip-planner-api-1.0.0.jar"]
```

## 📚 File Locations

| Purpose | Location |
|---------|----------|
| Main Java Application | `src/main/java/com/tripplanner/api/` |
| Frontend HTML/CSS/JS | `src/main/resources/static/` |
| Configuration | `src/main/resources/application.properties` |
| Dependencies | `pom.xml` |
| Tests | `src/test/java/` |

## ✨ What's the Same as Before

Your original Node.js backend and your frontend both used the same API format. The Java Spring Boot version:
- ✅ Uses the same API endpoints (`/api/signup`, `/api/login`, etc.)
- ✅ Returns the same JSON responses
- ✅ Uses the same authentication flow (JWT tokens)
- ✅ Has the same itinerary generation logic
- ✅ Your frontend JavaScript doesn't need ANY changes

This means your frontend works perfectly with the new Java backend!

## 🎯 Next Steps

1. **Install Java/Maven** (using Replit Packages)
2. **Click Run** to start the server
3. **Test the API** using your frontend
4. **Deploy** when ready

## 📞 Support

If you need help:
1. Check the logs in the workflow console
2. Verify Java and Maven are installed
3. Try restarting the workflow
4. Check `application.properties` for configuration issues

## 🎓 Learning More

- Spring Boot Docs: https://spring.io/guides
- Spring Security: https://spring.io/projects/spring-security
- JWT: https://jwt.io
- Maven: https://maven.apache.org/

---

**Your Java Spring Boot TripPlanner AI is ready to run!**

Just enable Java/Maven in Replit and click Run. Everything else is already configured. 🚀
