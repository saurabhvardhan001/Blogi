# Blogi - High-Level Design (HLD)

## Architecture Overview

**Blogi** is a 3-tier architecture application with the following layers:

### Layer 1: Frontend Client
- **Technology**: React 18 + Vite 5 + Material UI
- **Port**: 5173
- **Components**: 
  - Login/Register UI
  - Blog Editor
  - History/Post List
  - Live Markdown Preview with Meta Sidebar

### Layer 2: REST API (Spring Boot)
- **Technology**: Spring Boot 3.5.x, Java 17
- **Port**: 8080
- **Endpoints**:
  - `/api/auth/register` - User registration
  - `/api/auth/login` - User login with JWT
  - `/api/blog/generate` - AI blog generation
  - `/api/blog` - List user's blog posts
  - `/api/blog/{id}` - Get specific blog
- **Security**: JWT Token-based, CORS enabled

### Layer 3: Business Logic Services
1. **AuthService** - User registration, login, JWT generation
2. **BlogService** - Blog generation orchestration, prompt building
3. **OpenAIService** - Azure OpenAI REST API integration (WebClient)
4. **SeoService** - Readability score, SEO score, meta description
5. **PlagiarismService** - Content plagiarism detection

### Layer 4: Database
- **Technology**: MySQL 8+
- **Port**: 3306
- **Tables**:
  - `users` - User accounts with roles
  - `blog_posts` - Generated blog posts with metadata
  - `blog_keywords` - Keywords associated with posts
  - `user_roles` - User role assignments

### Layer 5: Security
- **JWT Service** - Token generation & validation (JJWT 0.11.5)
- **JWT Auth Filter** - Request-level authentication
- **BCrypt** - Password encryption
- **SecurityConfig** - Stateless, CSRF disabled

### Layer 6: External Integration
- **Azure OpenAI** - Cloud-based AI for blog generation via REST API

---

## Data Flow

```
User (Browser)
    ↓
React Frontend (Port 5173)
    ↓ [HTTP + Bearer JWT]
Spring Boot Backend (Port 8080)
    ↓ [Validate JWT via JwtAuthFilter]
    ├→ AuthService (User auth)
    ├→ BlogService (Orchestration)
    ├→ OpenAIService → Azure OpenAI [WebClient]
    ├→ SeoService (Scoring)
    └→ PlagiarismService (Detection)
    ↓ [JDBC]
MySQL Database
```

---

## Key Features

✅ **Authentication**: Secure JWT-based auth with BCrypt password hashing  
✅ **Blog Generation**: AI-powered using Azure OpenAI  
✅ **SEO Optimization**: Readability + SEO scoring + Meta generation  
✅ **History Management**: Users can view all their generated posts  
✅ **Content Tools**: Copy, Export as Markdown, Share functionality  
✅ **Live Preview**: Markdown rendering with syntax highlighting  
✅ **Stateless API**: Scalable REST architecture  
✅ **CORS Enabled**: Frontend-backend communication across ports  

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Material UI, Axios |
| **Backend** | Spring Boot 3.5.6, Java 17, Spring Security, Spring Data JPA |
| **Database** | MySQL 8+, JDBC Driver |
| **External API** | Azure OpenAI, Spring WebFlux (WebClient) |
| **Security** | JWT (JJWT 0.11.5), BCrypt, Spring Security |
| **Build** | Maven, Spring Boot Maven Plugin |
