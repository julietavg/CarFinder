CarFinder – Full-Stack Guide (Backend + Frontend)

Spring Boot (Java 17) + MySQL + React (Vite).
Roles: ADMIN (admin/admin123) & USER (user/user123).
UI shows Add/Edit/Delete only to ADMIN.

Repository Layout
CarFinder/
├─ backend/                        # Spring Boot app (pom.xml here)
│  ├─ src/main/java/com/carfinder/sales/...
│  │   ├─ CarFinderApplication.java
│  │   ├─ controllers/CarController.java
│  │   ├─ config/SecurityConfig.java
│  │   ├─ config/CorsConfig.java                 (optional global CORS)
│  │   ├─ services/CarService.java
│  │   ├─ repositories/CarRepository.java
│  │   ├─ entities/Car.java
│  │   ├─ dtos/CarDTO.java
│  │   ├─ mapper/CarMapper.java
│  │   ├─ api/AuthController.java                (GET /api/auth/me)
│  │   └─ api/ApiExceptionHandler.java           (@RestControllerAdvice)
│  └─ src/main/resources/application.properties
│
└─ carfinder-ui/                   # React + Vite app
   ├─ .env                         # VITE_API_BASE, etc.
   ├─ vite.config.ts (or .js)      # dev server proxy/port
   ├─ src/
   │  ├─ App.jsx                   # axios baseURL & auth; session (role)
   │  ├─ components/
   │  │  ├─ Login/Login.jsx
   │  │  ├─ Navigation/Navigation.jsx
   │  │  ├─ vehicle-list/VehicleList.jsx
   │  │  ├─ vehicle/VehicleForm.jsx
   │  │  ├─ vehicle/VehicleDetails.jsx
   │  │  ├─ vehicle/FilterPanel.jsx
   │  │  ├─ vehicle/ConfirmationModal.jsx
   │  │  └─ feedback/SuccessModal.jsx
   │  └─ styles/...
   └─ public/

1) Backend
1.1 Prereqs

Java 17+

Maven 3.9+ (or ./mvnw)

MySQL 8+

1.2 Database

Create DB (adjust user/pass as needed):

CREATE DATABASE vehicle_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Optionally create a user:
-- CREATE USER 'carfinder'@'%' IDENTIFIED BY 'strongpass';
-- GRANT ALL PRIVILEGES ON vehicle_db.* TO 'carfinder'@'%';
-- FLUSH PRIVILEGES;

1.3 backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:vehiclesdb}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:your_password}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
# Let Hibernate pick MySQL dialect automatically:
# spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

1.4 Security (HTTP Basic + roles)

@EnableMethodSecurity(prePostEnabled = true) on your security config.

Users:

admin/admin123 → ROLE_ADMIN

user/user123 → ROLE_USER

Rules:

GET /api/cars/** → ADMIN or USER

POST/PUT/DELETE /api/cars/** → ADMIN only

Auth endpoint: GET /api/auth/me returns { username, roles: [...] }.

1.5 CORS

Allow Vite dev origin. Option A: on controller:

@CrossOrigin(
  origins = "http://localhost:5173",
  allowedHeaders = {"Authorization","Content-Type","Accept"},
  methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT,RequestMethod.DELETE,RequestMethod.OPTIONS},
  allowCredentials = "true"
)
@RestController
@RequestMapping("/api/cars")
public class CarController { ... }


If you change the Vite port, update the origin accordingly.

1.6 Validation & Errors

Implemented in CarService + ApiExceptionHandler:

Required (no blanks): vin, make, model, subModel, transmission, color, image

VIN: uppercase, no I/O/Q, unique

Year ∈ [1930, 2026]

Price ∈ [5000.00, 350000.00]

Mileage > 0

Error payloads

400:

{ "message": "Validation failed.", "errors": { "year":"Year cannot be empty." } }


409:

{ "message":"Cannot add car with same VIN." }


404 / 500 analogous.

1.7 Run backend
cd CarFinder/backend
./mvnw spring-boot:run   # or: mvnw.cmd spring-boot:run (Windows)


Server: http://localhost:8080

Smoke test:

# Linux/macOS:
curl -i -u admin:admin123 http://localhost:8080/api/cars

# Windows PowerShell (use curl.exe):
curl.exe -i -u admin:admin123 http://localhost:8080/api/cars

2) Frontend
2.1 Prereqs

Node 18+ (20+ recommended)

npm 9+ (or pnpm/yarn)

2.2 .env (in carfinder-ui/)

Option A (no proxy, recommended):

VITE_API_BASE=http://localhost:8080/api


Option B (proxy via Vite):

VITE_API_BASE=/api


and vite.config.ts:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,        // don’t silently switch to 5174
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true }
    }
  }
});

2.3 Key files you already have
src/App.jsx

Sets axios.defaults.baseURL = import.meta.env.VITE_API_BASE.

Attaches Authorization: Basic <token> interceptor once.

Keeps session with { isLoggedIn, isAdmin, username }.

On login:

Validate /cars

Fetch /auth/me → derive isAdmin from roles.

src/components/vehicle-list/VehicleList.jsx

Loads /cars, normalizes subModel → submodel for UI.

Shows Add/Edit/Delete buttons only if isAdmin.

Calls backend:

POST /cars (admin)

PUT /cars/{id} (admin)

DELETE /cars/{id} (admin)

Shows SuccessModal with:

“Car has been added successfully.”

“Car Id X has been updated successfully.”

“Car Id X has been deleted successfully.”

Filters, sort, saved/favorites, search.

src/components/vehicle/VehicleForm.jsx

Client-side validation mirrors backend:

No blanks (VIN/Make/Model/Submodel/Transmission/Color/Image)

VIN uppercase, strips I/O/Q

Year [1930, 2026], Price [5000, 350000], Mileage ≥ 0

On server error:

400: maps errors to field messages (also maps subModel → submodel)

409: banner “Cannot add car with same VIN.”

src/components/Navigation/Navigation.jsx

Displays Admin or User name/initials.

Logo click returns to “Browse” (home inventory).

If you haven’t yet: make the logo a button and call onBrowse() from VehicleList (already wired).

2.4 Run frontend
cd CarFinder/carfinder-ui
npm i
npm run dev


Open http://localhost:5173

2.5 Logins

Admin: admin / admin123 → can create/edit/delete

User: user / user123 → read-only

3) API Cheatsheet

List

curl -u user:user123 http://localhost:8080/api/cars


Create (ADMIN)

curl -X POST -u admin:admin123 http://localhost:8080/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "vin":"1HGCM82633A004352",
    "year":2022,
    "make":"HONDA",
    "model":"ACCORD",
    "subModel":"EX-L",
    "mileage":15000,
    "color":"Blue",
    "transmission":"Automatic",
    "price":24000.00,
    "image":"https://example.com/img.jpg"
  }'


Update (ADMIN)

curl -X PUT -u admin:admin123 http://localhost:8080/api/cars/21 \
  -H "Content-Type: application/json" \
  -d '{"vin":"...", "year":2021, "make":"...", "model":"...", "subModel":"...","mileage":20000,"color":"Black","transmission":"Manual","price":19999.99,"image":"..."}'


Delete (ADMIN)

curl -X DELETE -u admin:admin123 http://localhost:8080/api/cars/21


Who am I?

curl -u admin:admin123 http://localhost:8080/api/auth/me

4) Troubleshooting (based on issues we hit)

CORS (No 'Access-Control-Allow-Origin'):

Backend @CrossOrigin(origins="http://localhost:5173", allowCredentials="true").

Ensure .env → VITE_API_BASE=http://localhost:8080/api (Option A), or use Vite proxy (Option B).

Fix Vite port drift using strictPort: true (so you notice if it tries 5174).

Port already in use:

Free 8080 (backend) or change server.port.

Free 5173 (frontend) or change Vite port (and update CORS origin).

401 on login:

Wrong creds, or interceptor not attaching Authorization. Clear localStorage.basicAuth, refresh and try again.

403 when saving/deleting:

You logged in as user/user123. Only ADMIN can POST/PUT/DELETE.

409 duplicate VIN:

Change VIN. The backend enforces uniqueness (create & update).

“Unknown database 'vehicle_db'”:

Create DB; verify JDBC URL and credentials.

5) Suggested Scripts (optional)

Unix (CarFinder/Makefile):

run-backend:
\tcd backend && ./mvnw spring-boot:run

run-frontend:
\tcd carfinder-ui && npm run dev


Windows (CarFinder/run-backend.bat / run-frontend.bat):

:: run-backend.bat
cd backend
mvnw.cmd spring-boot:run

:: run-frontend.bat
cd carfinder-ui
npm run dev

6) Screenshots (placeholders)

Add these under CarFinder/docs/screenshots/:

login.png – Login page

inventory.png – Card grid with filters

edit.png – Edit modal

success.png – Success modal (“Car has been added successfully.”)

Reference them in your README if you want:

![Login](docs/screenshots/login.png)
![Inventory](docs/screenshots/inventory.png)
![Edit](docs/screenshots/edit.png)
![Success](docs/screenshots/success.png)

7) Notes on Mapping & Validation

Mapping: Backend uses subModel; UI uses submodel.

In reads: subModel → submodel

In writes: submodel → subModel

VIN cleaning (UI): uppercase + strips I/O/Q on change.

Field coverage: both client and server validate; server is the source of truth.

Logo to Home: in Navigation.jsx, logo is a button that calls onBrowse(); VehicleList handles this by resetting filters/search to show inventory.

8) What to Commit

This README

Backend config (application.properties) without real passwords in VCS (use env vars in prod).

Frontend .env.example (not your real .env).

Add /docs/screenshots/*.png when ready.

👨‍💻 Authors:

1. Mariana Rebollar
2. Julieta Vargas
3. Enrique Hernandez
4. Saul Flores
