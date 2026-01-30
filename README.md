# Blogi — AI-Powered Blog Generator

Generate **SEO-optimized, Markdown-formatted blog posts** from a simple brief.

**Backend:** Spring Boot (Java 17), MySQL, JWT  
**Frontend:** React + Vite + Material UI  
**AI:** Azure OpenAI (REST)

---

## ✨ Features

- **AI blog generation** using Azure OpenAI  
  - Inputs: topic, keywords, tone, audience, length
- **SEO helpers**
  - Meta title & description
  - Readability score
  - Keyword utilization scoring
- **Clean UX**
  - Live Markdown preview
  - Meta sidebar
  - Skeleton loaders
  - Snackbars
- **Productivity tools**
  - Copy to clipboard
  - Export as Markdown
  - View generation history
- **Security**
  - JWT authentication (register/login)
  - BCrypt password hashing

---

## 🧱 Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.x
- Spring Web
- Spring Security (JWT)
- Spring Data JPA
- Spring Validation
- Spring WebFlux (`WebClient`)
- MySQL 8+
- JJWT 0.11.5

### Frontend
- React 18
- Vite 5
- Material UI
- Axios
- `react-markdown` (+ GFM)
- `rehype-sanitize`
- Syntax highlighting

---

## 📁 Project Structure

```
/blogi-backend
 ├─ src/main/java/com/blogi
 │  ├─ BlogiApplication.java
 │  ├─ config/
 │  │   ├─ SecurityConfig.java
 │  │   └─ JwtProperties.java
 │  ├─ controller/
 │  │   ├─ AuthController.java
 │  │   └─ BlogController.java
 │  ├─ dto/
 │  │   ├─ AuthRequest.java
 │  │   ├─ LoginRequest.java
 │  │   ├─ GenerateRequest.java
 │  │   ├─ BlogResponse.java
 │  │   └─ AuthResponse.java
 │  ├─ entity/
 │  │   ├─ User.java
 │  │   └─ BlogPost.java
 │  ├─ exception/
 │  │   ├─ GlobalExceptionHandler.java
 │  │   └─ CustomExceptions.java
 │  ├─ repository/
 │  │   ├─ UserRepository.java
 │  │   └─ BlogRepository.java
 │  ├─ security/
 │  │   ├─ JwtService.java
 │  │   ├─ JwtAuthFilter.java
 │  │   └─ AppUserDetailsService.java
 │  └─ service/
 │      ├─ AuthService.java
 │      ├─ BlogService.java
 │      ├─ OpenAIService.java
 │      ├─ SeoService.java
 │      └─ PlagiarismService.java
 └─ src/main/resources
    └─ application.properties

/blogi-frontend
 └─ src
    ├─ services/
    │  └─ api.js
    ├─ ui/
    │  ├─ App.jsx
    │  ├─ Login.jsx
    │  ├─ Register.jsx
    │  ├─ Editor.jsx
    │  └─ History.jsx
    └─ components/
       ├─ MarkdownRenderer.jsx
       ├─ MetaSidebar.jsx
       ├─ ScorePill.jsx
       └─ BlogCard.jsx
```

---

## ⚙️ Configuration

### Backend

`blogi-backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blogi
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

azure.openai.endpoint=${AZURE_OPENAI_ENDPOINT:}
azure.openai.key=${AZURE_OPENAI_KEY:}
azure.openai.deployment=${AZURE_OPENAI_DEPLOYMENT:}
azure.openai.api-version=2024-02-15-preview

jwt.secret=${JWT_SECRET:}
jwt.expiration=86400000
```

🔐 **Tip:** Use environment variables instead of committing secrets.

---

### Frontend

`blogi-frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🗃️ Database Setup

```sql
CREATE DATABASE blogi;
```

---

## 🚀 Run Locally

### Backend

```bash
cd blogi-backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd blogi-frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## 🔐 Auth Flow

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- JWT stored in `localStorage`
- Sent as `Authorization: Bearer <token>`

---

## 📡 API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/blog/generate`
- `GET /api/blog`
- `GET /api/blog/{id}`

---

## 🗺️ Roadmap

- Outline-first mode
- Rich editor & post-edit
- Image suggestions
- Fact-check & citations
- WordPress/Medium publishing
- Docker Compose & Flyway

---

## 🤝 Contributing

Fork → Feature branch → PR with description & screenshots

---

## 📄 License

Not required.

---

**Happy blogging with Blogi! 🚀**

