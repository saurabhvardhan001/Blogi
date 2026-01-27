                 Blogi — AI‑Powered Blog Generator
Generate SEO‑optimized, Markdown‑formatted blog posts from a simple brief.
Backend: Spring Boot (Java 17), MySQL, JWT · Frontend: React + Vite + Material UI · AI: Azure OpenAI (REST)

✨ Features

AI generation using Azure OpenAI (topic, keywords, tone, audience, length)
SEO helpers: meta title/description, readability & keyword utilization scoring
Clean UX: Markdown preview, meta sidebar, skeleton loaders, snackbars
Tools: copy to clipboard, export as Markdown, view history
Security: JWT auth (register/login), BCrypt password hashing


🧱 Tech Stack

Backend: Java 17, Spring Boot 3.5.x, Web, Security (JWT), Data JPA, Validation, WebFlux (WebClient)
Database: MySQL 8+ (Connector/J)
Frontend: React 18, Vite 5, Material UI, Axios, react‑markdown (+ GFM), rehype‑sanitize, syntax highlighting
Auth: JWT (JJWT 0.11.5)


📁 Project Structure
/blogi-backend
  ├─ src/main/java/com/blogi
  │  ├─ BlogiApplication.java
  │  ├─ config/            (SecurityConfig, JwtProperties)
  │  ├─ controller/        (AuthController, BlogController)
  │  ├─ dto/               (AuthRequest, LoginRequest, GenerateRequest, BlogResponse, AuthResponse)
  │  ├─ entity/            (User, BlogPost)
  │  ├─ exception/         (GlobalExceptionHandler + custom exceptions)
  │  ├─ repository/        (UserRepository, BlogRepository)
  │  ├─ security/          (JwtService, JwtAuthFilter, AppUserDetailsService)
  │  └─ service/           (AuthService, BlogService, OpenAIService, SeoService, PlagiarismService)
  └─ src/main/resources/   (application.properties)

/blogi-frontend
  └─ src
     ├─ services/api.js    (Axios + JWT interceptor)
     └─ ui/
        ├─ App.jsx, Login.jsx, Register.jsx, Editor.jsx, History.jsx
        └─ components/     (MarkdownRenderer, MetaSidebar, ScorePill, BlogCard)


⚙️ Configuration
Backend — blogi-backend/src/main/resources/application.properties


🔐 Tip: Use env vars instead of committing secrets:
azure.openai.key=${AZURE_OPENAI_KEY:} and set AZURE_OPENAI_KEY in your shell/CI.

Frontend — blogi-frontend/.env


🗃️ Database
Create the DB once:

Update spring.datasource.username/password accordingly.

🚀 Run Locally
Backend

Frontend

Open http://localhost:5173.

🔐 Auth Flow

Register at /api/auth/register (username, email, password) → returns JWT
Login at /api/auth/login (username, password) → returns JWT
Frontend stores JWT in localStorage and attaches Authorization: Bearer <token> automatically.


📡 API (for Postman)
Register
POST /api/auth/register

Login
POST /api/auth/login

Generate Blog (requires JWT)
POST /api/blog/generate

List Blogs (requires JWT)
GET /api/blog
Get Blog by ID (requires JWT)
GET /api/blog/{id}

A Postman collection can be added at blogi-backend/postman-collection.json.


🖥️ Frontend UX Highlights

Editor: form (topic/keywords/tone/audience/length) + live reading pane with Markdown
Meta sidebar: meta title/description, scores (readability/SEO), keywords as chips, quick actions (copy/export/share)
History: card/grid view with preview dialog
UX niceties: skeleton loaders, snackbars, syntax-highlighted code blocks


🧪 Troubleshooting

403/401 on /api/blog/*

Register/login first; ensure JWT is present in Authorization header.


“Generation failed”

Check Azure OpenAI credentials (key/endpoint/deployment/api-version).
For demo, add a fallback in OpenAIService.generateBlog() to return sample content if API fails.


IDE warnings about custom properties

Ensure spring-boot-configuration-processor is in pom.xml.
Optional: add META-INF/additional-spring-configuration-metadata.json.




🗺️ Roadmap

Outline‑first mode; section expand
Rich editor to post‑edit + save
Image suggestions (Unsplash/Pexels/Azure Images)
Fact‑check & citations
Publish to WordPress/Medium
Email verification & password reset
Rate‑limiting & CAPTCHA on auth
Docker Compose & Flyway migrations


🤝 Contributing

Fork & create a feature branch
Follow Java 17 + Spring Boot 3.5.x and ESLint/Prettier conventions
Submit a PR with a clear description and screenshots


📄 License
MIT — see LICENSE for details.

Happy blogging with Blogi!
