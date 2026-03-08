# TripPlanner AI - Java Spring Boot Version

## Overview

TripPlanner AI is an AI-powered travel itinerary planning website. The frontend uses vanilla HTML5, CSS3, and JavaScript, while the backend has been converted to Java Spring Boot. Users can explore destinations, sign up, log in, and generate personalized trip itineraries based on their preferences including destination, travel dates, budget, and number of travelers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Vanilla HTML/CSS/JavaScript**: Static files served by Spring Boot
- **Files Location**: `src/main/resources/static/`
- **Pages**: 
  - `index.html` - Home page with destination listing
  - `login.html` - User login page
  - `signup.html` - User registration page
  - `dashboard.html` - Trip planning dashboard
  - `css/style.css` - Main styling
  - `js/main.js` - Application JavaScript logic
- **Features**: 38 destinations across 6 categories, Google Maps integration, search and filter functionality, Leaflet.js maps

### Backend Architecture
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Build Tool**: Maven
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix
- **Database**: H2 in-memory (development), PostgreSQL (production)
- **Authentication**: JWT token-based with custom JwtTokenProvider
- **Port**: 5000

### Project Structure

```
src/main/java/com/tripplanner/api/
├── TripPlannerApplication.java       # Spring Boot main application
├── controller/
│   ├── AuthController.java           # Login, signup, logout endpoints
│   ├── ItineraryController.java       # Trip itinerary generation
│   └── StaticController.java          # Static file serving
├── service/
│   ├── AuthService.java              # Authentication logic
│   ├── UserService.java              # User CRUD operations
│   └── ItineraryService.java          # Itinerary generation logic
├── model/
│   └── User.java                     # User entity
├── dto/
│   ├── LoginRequest.java
│   ├── SignupRequest.java
│   ├── AuthResponse.java
│   ├── UserDTO.java
│   ├── GenerateItineraryRequest.java
│   └── ItineraryResponse.java
├── repository/
│   └── UserRepository.java           # User JPA repository
├── security/
│   ├── JwtTokenProvider.java         # JWT token generation & validation
│   └── JwtAuthenticationFilter.java   # JWT authentication filter
└── config/
    └── SecurityConfig.java           # Spring Security configuration

src/main/resources/
├── application.properties            # Development configuration
├── application-prod.properties       # Production configuration
└── static/                           # Frontend files (HTML, CSS, JS)
    ├── index.html
    ├── login.html
    ├── signup.html
    ├── dashboard.html
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── public/
        └── (images and assets)

pom.xml                               # Maven project configuration
```

## Key Features

### Authentication
- User registration and login with JWT tokens
- Token-based authorization on protected endpoints
- Password hashing with BCrypt
- Automatic token generation and validation

### API Endpoints

**Public Endpoints:**
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /`, `/index.html`, `/login.html`, `/signup.html`, `/dashboard.html` - Static files

**Protected Endpoints (require JWT token in Authorization header):**
- `GET /api/user` - Get current user info
- `POST /api/generate-itinerary` - Generate trip itinerary
- `POST /api/logout` - User logout

### Destinations
- 38 total destinations
- 6 categories: Hill Stations, Beaches, Heritage & Cultural, Adventure, Romantic/Honeymoon, International
- Real images from Unsplash with fallback placeholders
- Interactive maps with Leaflet.js and Google Maps integration

### Itinerary Generation
- Destination-specific information (landmarks, attractions)
- Day-wise travel plans based on trip duration
- Hotel recommendations with pricing
- Flight options with duration and cost
- Railway options with schedules
- Budget-based pricing variations

## Dependencies

### Spring Boot Starters
- spring-boot-starter-web
- spring-boot-starter-security
- spring-boot-starter-data-jpa
- spring-boot-starter-validation

### JWT
- jjwt-api, jjwt-impl, jjwt-jackson (version 0.12.3)

### Database
- H2 Database (development)
- PostgreSQL Driver (production)

### Other
- Lombok (code generation)
- Jackson (JSON processing)

## Configuration

### Development (Default)
- Database: H2 in-memory (`jdbc:h2:mem:testdb`)
- JPA DDL: `create-drop` (recreates schema on startup)
- Logging: DEBUG level for com.tripplanner

### Production
- Database: PostgreSQL (via DATABASE_URL environment variable)
- JPA DDL: `update` (preserves existing data)
- JWT Secret: Via JWT_SECRET environment variable
- Logging: WARN level (INFO for tripplanner)

### Environment Variables (Production)
```
DATABASE_URL=jdbc:postgresql://host:5432/dbname
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
```

## Running the Project on Replit

### Prerequisites
- Java 17+ (included in Replit with java module)
- Maven 3.6+ (included in Replit with maven module)
- Node.js (removed; no longer needed)

### Development
1. Open the Replit project
2. The workflow is configured to run: `mvn clean spring-boot:run -DskipTests -q`
3. Click the "Run" button to start the server
4. Access the application at `https://<replit-project-name>.replit.dev`

### First Run
- Maven will download all dependencies (may take 1-2 minutes)
- H2 database will be initialized automatically
- Server starts on port 5000

### Testing the API
```bash
# Signup
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Generate Itinerary (use token from login response)
curl -X POST http://localhost:5000/api/generate-itinerary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "destination":"Paris",
    "startDate":"2024-04-01",
    "endDate":"2024-04-05",
    "budget":"moderate",
    "travellers":"2"
  }'
```

## Building for Production

### Build JAR
```bash
mvn clean package -DskipTests -q
```

### Run JAR
```bash
java -jar target/trip-planner-api-1.0.0.jar --spring.profiles.active=prod
```

### Docker (Optional)
```dockerfile
FROM openjdk:17-slim
COPY target/trip-planner-api-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## Migration Notes

This project was originally built with:
- Node.js + Express.js backend
- Vanilla JavaScript frontend

It has been migrated to:
- Java Spring Boot backend
- Same vanilla JavaScript frontend (no changes)

### What Changed
- Backend: Node.js/Express → Java/Spring Boot
- Database: In-memory Map → JPA/H2 (development) or PostgreSQL (production)
- Auth: Simple token Map → JWT with JwtTokenProvider
- Build: npm → Maven

### What Stayed the Same
- All frontend HTML, CSS, and JavaScript files
- Same API endpoints and response formats
- Same features and user experience
- Same destination data and itinerary generation logic

## Troubleshooting

### Port 5000 Already in Use
- Kill existing process: `lsof -ti:5000 | xargs kill -9`
- Or change port in `application.properties`: `server.port=5001`

### Dependencies Not Downloading
- Check internet connection
- Clear Maven cache: `rm -rf ~/.m2/repository`
- Run: `mvn clean install`

### Database Errors
- Check application.properties for correct database configuration
- For PostgreSQL, ensure DATABASE_URL is set correctly
- H2 database resets on each startup (create-drop mode)

### JWT Token Expired
- Default expiration: 24 hours (86400000 ms)
- Change via JWT_EXPIRATION environment variable
- Re-login to get new token

## Performance Notes

- H2 in-memory database: Good for development, data lost on restart
- PostgreSQL: Persistent storage for production
- Static files served directly by Spring Boot
- No hot-reload in development (restart workflow to see code changes)
- CORS enabled for all origins on `/api/**` endpoints

## Security Considerations

1. **JWT Secret**: Must be changed in production via JWT_SECRET environment variable
2. **HTTPS**: Use HTTPS in production (Replit handles this automatically)
3. **Password Hashing**: BCrypt with strength 10
4. **CORS**: Currently allows all origins; restrict as needed in production
5. **Database**: Use PostgreSQL with strong credentials in production
6. **Session**: Stateless JWT authentication (no session storage)

## Support

For issues or questions:
1. Check logs: Workflow console output
2. Verify configuration: Check application.properties
3. Test API: Use curl commands above
4. Check database: Access H2 console at `/h2-console` (development only)
