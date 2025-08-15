\# 🚗 CarFinder API



CarFinder is a full-stack web application designed to manage and explore a car inventory system. It provides RESTful endpoints for creating, updating, deleting, and retrieving car data, with role-based access control for administrators and regular users.



---



\## 📌 Purpose



This project demonstrates:

\- Robust backend architecture using \*\*Spring Boot\*\*

\- DTO-based data transfer and validation

\- Role-based security with \*\*Spring Security\*\*

\- API documentation via \*\*Swagger/OpenAPI\*\*

\- Reproducible testing via \*\*Postman Collection\*\*

\- Integration-ready endpoints for frontend consumption



---



\## 🧱 Project Structure





---



\## 🔐 Roles



| Role   | Access Level |

|--------|--------------|

| Admin  | Full CRUD    |

| User   | Read-only    |



---



\## 🚀 Endpoints



\### 🔍 Public (User \& Admin)



| Method | Endpoint             | Description             |

|--------|----------------------|-------------------------|

| GET    | `/cars`              | Get all cars            |

| GET    | `/cars/{id}`         | Get car by ID           |



\### 🔧 Admin Only



| Method | Endpoint             | Description             |

|--------|----------------------|-------------------------|

| POST   | `/cars`              | Create a new car        |

| PUT    | `/cars/{id}`         | Update a car            |

| DELETE | `/cars/{id}`         | Delete a car            |



---



\## 📦 Sample JSON Payload



```json

{

&nbsp; "vin": "1HGCM82633A004352",

&nbsp; "make": "Honda",

&nbsp; "model": "Civic",

&nbsp; "subModel": "EX",

&nbsp; "year": 2020,

&nbsp; "price": 23499.00,

&nbsp; "mileage": 16500,

&nbsp; "color": "Red",

&nbsp; "transmission": "Automatic",

&nbsp; "image": "https://example.com/car.jpg"

}



🔐 Authentication

Uses Basic Auth for simplicity:



Username	Password	Role

admin	admin123	ADMIN

user	user123	USER

📘 Swagger UI

Access interactive API docs at:



Code

http://localhost:8080/swagger-ui/index.html

🧪 Postman Collection

A ready-to-import Postman collection is available to test all endpoints. Includes:



Auth headers



Sample payloads



Success \& error response examples



🛠 Technologies Used

Java 17



Spring Boot 3.x



Spring Security



Spring Data JPA



MySQL



Swagger (Springdoc OpenAPI)



Postman



📂 Setup Instructions

Clone the repo



Configure application.properties with your MySQL credentials



Run the app with mvn spring-boot:run



Access Swagger or test via Postman



🧠 Future Enhancements

JWT-based authentication



Pagination and filtering



Frontend integration (React or Angular)



Dockerized deployment



👨‍💻 Authors:



1. Mariana Rebollar
2. Julieta Vargas
3. Enrique Hernandez
4. Saul Flores
