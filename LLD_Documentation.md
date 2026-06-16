# Blogi - Low-Level Design (LLD)

## Detailed Component Architecture

---

## FRONTEND LAYER (React + Vite + Material UI)

### UI Components

#### **App.jsx**
- Router setup with react-router-dom
- Navigation bar with conditional rendering (auth state)
- Private route protection
- Route definitions:
  - `/login` → Login
  - `/register` → Register
  - `/editor` → Blog Editor (protected)
  - `/history` → Blog History (protected)
  - `/` → Redirect to /editor

#### **Login.jsx**
- Form inputs: username, password
- Error state management
- POST `/api/auth/login`
- Token stored in localStorage
- Dispatches `auth:change` event on success
- Redirects to `/editor`

#### **Register.jsx**
- Form inputs: username, email, password
- Error state management
- POST `/api/auth/register`
- Token stored in localStorage
- Dispatches `auth:change` event on success
- Redirects to `/editor`

#### **Editor.jsx**
- Blog generation form with inputs:
  - topic (text)
  - keywords (comma-separated)
  - tone (dropdown: Formal, Casual, Academic, etc.)
  - audience (dropdown: Beginners, Intermediate, Experts)
  - length (numeric: words)
- Loading state with skeleton loaders
- Result state management
- Calls: `api.post('/api/blog/generate', request)`
- Displays MarkdownRenderer on success
- Shows toast notifications

#### **History.jsx**
- Fetches: `api.get('/api/blog')` on mount
- Displays list of user's blog posts in Grid
- Uses BlogCard component for each post
- Dialog modal to view full blog
- Event listener for `auth:change` to re-fetch
- Shows empty state if no posts

#### **MarkdownRenderer.jsx**
- Uses `react-markdown` library
- Plugins: `remarkGfm` (tables, strikethrough), `rehypeRaw`, `rehypeSanitize`
- Syntax highlighting with `react-syntax-highlighter`
- Custom component mappings:
  - h1, h2, h3 → Typography variants with slugified IDs
  - p → Typography with paragraph
  - a → Link with smooth scroll for hash links
  - code → SyntaxHighlighter for inline code blocks
- Sanitizes HTML to prevent XSS

### Helper Components

#### **MetaSidebar.jsx**
- Displays SEO metadata
- Shows scores: Readability, SEO, Plagiarism (with color scaling)
- Displays keywords as chips
- Action buttons: Copy, Download, Share (top-right)
- Position: sticky sidebar

#### **BlogCard.jsx**
- Card component for each blog in history
- Displays: metaTitle, metaDescription, first 3 keywords
- Clickable to open detail modal
- Responsive grid layout

#### **ScorePill.jsx**
- Chip component for score display
- Color scaling (green/info/warning/error)
- Label + numeric value
- Tooltip on hover

### Services

#### **api.js** (Axios Instance)
```javascript
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
```
- Automatically adds JWT token from localStorage to all requests
- Base URL from env variable (default: http://localhost:8080/api)

### Storage & Events

#### **localStorage**
- Key: `token` → Stores JWT token
- Persists across page reloads

#### **Event System**
- Event name: `auth:change`
- Dispatched on login/register/logout
- Listeners: History component re-fetches blogs

### Libraries Used
```json
{
  "react": "^18",
  "react-router-dom": "^6",
  "@mui/material": "^5",
  "@mui/icons-material": "^5",
  "axios": "^1",
  "react-markdown": "^8",
  "remark-gfm": "^3",
  "rehype-sanitize": "^5",
  "react-syntax-highlighter": "^15"
}
```

---

## BACKEND LAYER (Spring Boot 3.5.6, Java 17)

### Controllers

#### **AuthController** (`@RestController @RequestMapping("/api/auth")`)
```java
@PostMapping("/register")
ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest req)
  → Calls: AuthService.register()
  → Returns: JWT token + username

@PostMapping("/login")
ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req)
  → Calls: AuthService.login()
  → Returns: JWT token + username
```

#### **BlogController** (`@RestController @RequestMapping("/api/blog")`)
```java
@PostMapping("/generate")
ResponseEntity<BlogResponse> generate(@Valid @RequestBody GenerateRequest req, 
                                      Authentication auth)
  → Calls: BlogService.generateAndSave()
  → Returns: BlogResponse with generated content + scores

@GetMapping
List<BlogResponse> list(@RequestHeader Authorization jwt)
  → Calls: BlogRepository.findPostsByAuthorId()
  → Returns: List of user's blog posts

@GetMapping("/{id}")
BlogResponse get(@PathVariable Long id)
  → Calls: BlogRepository.findById()
  → Returns: Single blog post
```

### Services

#### **AuthService**
```java
AuthResponse register(AuthRequest req)
  ├─ Check if username/email exists
  ├─ Hash password: BCrypt
  ├─ Save User entity with "USER" role
  └─ Generate JWT token

AuthResponse login(LoginRequest req)
  ├─ Authenticate: AuthenticationManager
  ├─ Validate credentials
  └─ Generate JWT token
```

#### **BlogService**
```java
BlogPost generateAndSave(GenerateRequest req, String username)
  ├─ buildPrompt() → Constructs AI prompt
  │   ├─ Topic
  │   ├─ Keywords
  │   ├─ Tone
  │   ├─ Target Audience
  │   └─ Length
  ├─ OpenAIService.generateBlog(prompt) → Get content
  ├─ deriveTitle() → Extract H1 from content
  ├─ SeoService.metaDescription()
  ├─ SeoService.readabilityScore()
  ├─ SeoService.seoScore()
  ├─ PlagiarismService.score()
  ├─ Find User by username
  ├─ Create BlogPost entity
  └─ Save to database
```

#### **OpenAIService**
```java
String generateBlog(String prompt)
  ├─ Build HTTP request to Azure OpenAI
  │   ├─ URL: ${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}
  │   ├─ Headers: api-key
  │   └─ Body: messages[] (system role + user prompt)
  ├─ WebClient.post().bodyValue(body)
  ├─ Parse response: choices[0].message.content
  └─ Return blog content or empty string on error
```

#### **SeoService**
```java
int readabilityScore(String content)
  ├─ Split by sentences [.!?]
  ├─ Calculate average words per sentence
  └─ Score: 100 - (avgLen - 12) * 3  [0-100]

double seoScore(String title, List<String> keywords, String content)
  ├─ Keyword density: count occurrences / 5
  ├─ Title length score: title.length() / 60
  └─ Combined score: 0.6 * keyword + 0.4 * title  [0-1]

String metaDescription(String content)
  ├─ Remove markdown symbols
  ├─ Trim to 155 chars
  └─ Return clean description
```

#### **PlagiarismService**
```java
double score(String content)
  └─ Returns: plagiarism score [0-1] (simple detection)
```

### Security Layer

#### **JwtService**
```java
String generateToken(String username)
  ├─ Create JWT with claims
  ├─ Set expiration: 24 hours
  └─ Sign with secret key

String extractUsername(String token)
  ├─ Parse JWT
  └─ Extract 'sub' claim

boolean isTokenValid(String token)
  └─ Check expiration + signature
```

#### **JwtAuthFilter** (extends `OncePerRequestFilter`)
```java
doFilterInternal(HttpServletRequest request, ...)
  ├─ Extract Bearer token from Authorization header
  ├─ Validate token via JwtService
  ├─ Extract username
  ├─ Load UserDetails via AppUserDetailsService
  ├─ Create Authentication object
  └─ Set SecurityContext
```

#### **AppUserDetailsService** (implements `UserDetailsService`)
```java
loadUserByUsername(String username)
  ├─ Query User from UserRepository
  ├─ Convert to UserDetails with roles
  └─ Return for Spring Security
```

#### **SecurityConfig**
```java
@Bean SecurityFilterChain filterChain(HttpSecurity http)
  ├─ CSRF disabled
  ├─ Session management: STATELESS
  ├─ Authorization rules:
  │   ├─ /api/auth/** → permitAll()
  │   └─ /** → authenticated()
  └─ Add JwtAuthFilter before UsernamePasswordAuthenticationFilter

@Bean PasswordEncoder passwordEncoder()
  └─ Return: BCryptPasswordEncoder

@Bean AuthenticationManager authenticationManager()
  └─ Return: AuthenticationManager from config
```

### Repositories (Spring Data JPA)

#### **UserRepository** (extends `JpaRepository<User, Long>`)
```java
Optional<User> findByUsername(String username)
boolean existsByUsername(String username)
boolean existsByEmail(String email)
```

#### **BlogRepository** (extends `JpaRepository<BlogPost, Long>`)
```java
List<BlogPost> findPostsByAuthorId(Long authorId)
```

### DTOs (Data Transfer Objects)

#### **AuthRequest**
```java
String username;
String email;
String password;
```

#### **LoginRequest**
```java
String username;
String password;
```

#### **GenerateRequest**
```java
String topic;
List<String> keywords;
String tone;
String targetAudience;
int length;
```

#### **BlogResponse**
```java
Long id;
String title;
String content;
String metaTitle;
String metaDescription;
List<String> keywords;
int readabilityScore;
double seoScore;
double plagiarismScore;
```

#### **AuthResponse**
```java
String token;
String username;
```

### Entities (JPA)

#### **User**
```java
@Entity @Table(name = "users")
├─ @Id @GeneratedValue
│  Long id (PK)
├─ @Column(unique, nullable)
│  String username
├─ @Column(unique, nullable)
│  String email
├─ @Column(nullable)
│  String password
├─ @ElementCollection(EAGER)
│  Set<String> roles
└─ @OneToMany
   List<BlogPost> blogPosts
```

#### **BlogPost**
```java
@Entity @Table(name = "blog_posts")
├─ @Id @GeneratedValue
│  Long id (PK)
├─ String title
├─ @Column(LONGTEXT)
│  String content
├─ String metaTitle
├─ @Column(length = 500)
│  String metaDescription
├─ @ElementCollection
│  List<String> keywords
├─ int readabilityScore
├─ double seoScore
├─ double plagiarismScore
├─ @PrePersist @PreUpdate
│  LocalDateTime createdAt, updatedAt
└─ @ManyToOne(LAZY)
   User author (FK)
```

### Exception Handling

#### **GlobalExceptionHandler**
```java
@ControllerAdvice
├─ @ExceptionHandler(BadRequestException.class)
├─ @ExceptionHandler(NotFoundException.class)
└─ Custom exception responses
```

---

## DATABASE LAYER (MySQL 8+)

### Schema

#### **users** table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

#### **user_roles** table (ElementCollection JOIN)
```sql
CREATE TABLE user_roles (
  user_id BIGINT PRIMARY KEY,
  role VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### **blog_posts** table
```sql
CREATE TABLE blog_posts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  content LONGTEXT,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  readability_score INT,
  seo_score DOUBLE,
  plagiarism_score DOUBLE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  author_id BIGINT,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

#### **blog_keywords** table (ElementCollection JOIN)
```sql
CREATE TABLE blog_keywords (
  blog_id BIGINT,
  keyword VARCHAR(255),
  FOREIGN KEY (blog_id) REFERENCES blog_posts(id)
);
```

### Configuration (application.properties)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blogi
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

azure.openai.endpoint=${AZURE_OPENAI_ENDPOINT}
azure.openai.key=${AZURE_OPENAI_KEY}
azure.openai.deployment=${AZURE_OPENAI_DEPLOYMENT}
azure.openai.api-version=2024-02-15-preview

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000  # 24 hours in milliseconds
```

---

## COMMUNICATION FLOW

### Request Flow (Blog Generation)

```
1. User enters topic, keywords, tone, audience, length in Editor.jsx
2. Editor.jsx calls: api.post('/api/blog/generate', request)
3. Request includes: Authorization: Bearer {token}
4. Spring Boot receives request at BlogController.generate()
5. JwtAuthFilter extracts token, validates, sets Authentication
6. BlogController extracts username from Authentication
7. BlogService.generateAndSave(request, username):
   ├─ buildPrompt(request)
   ├─ OpenAIService.generateBlog(prompt)
   │  └─ WebClient → Azure OpenAI → Returns content
   ├─ SeoService.readabilityScore(content)
   ├─ SeoService.seoScore(title, keywords, content)
   ├─ SeoService.metaDescription(content)
   ├─ PlagiarismService.score(content)
   ├─ Find User by username
   ├─ Create BlogPost entity with all data
   └─ BlogRepository.save(post) → MySQL INSERT
8. BlogController.toDto() converts BlogPost to BlogResponse
9. Response sent back to frontend with 200 OK
10. Editor.jsx receives response, displays MarkdownRenderer
11. MetaSidebar shows scores
```

### Authentication Flow

```
Register:
  User fills form → api.post('/auth/register', {username, email, password})
  → AuthController.register()
  → AuthService.register()
    ├─ Check duplicates
    ├─ Hash password: BCrypt
    ├─ Save User
    └─ Generate JWT
  → Return token → Store in localStorage → Redirect to /editor

Login:
  User fills form → api.post('/auth/login', {username, password})
  → AuthController.login()
  → AuthService.login()
    ├─ AuthenticationManager.authenticate()
    ├─ Generate JWT
  → Return token → Store in localStorage → Redirect to /editor
```

---

## Key Dependencies

```xml
<!-- Spring Boot -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Security -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.11.5</version>
</dependency>

<!-- Database -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
</dependency>

<!-- WebFlux for Azure OpenAI calls -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

---

## Design Patterns Used

✅ **MVC Pattern** - Controllers, Services, Repositories  
✅ **DTO Pattern** - Request/Response separation  
✅ **Singleton Pattern** - Spring Beans  
✅ **Filter Pattern** - JwtAuthFilter  
✅ **Strategy Pattern** - Multiple scoring services  
✅ **Observer Pattern** - Event dispatching (auth:change)  
✅ **Repository Pattern** - JPA abstraction  

---

## Security Measures

🔒 **JWT Token-based Auth** - Stateless, no session  
🔒 **BCrypt Password Hashing** - Industry standard  
🔒 **CSRF Protection Disabled** - Stateless API (not needed)  
🔒 **CORS Enabled** - Controlled cross-origin requests  
🔒 **Bearer Token in Headers** - HTTP Authorization header  
🔒 **Token Expiration** - 24 hours  
🔒 **Role-based Access Control** - USER role assignment  
🔒 **Request Validation** - @Valid annotations  
🔒 **Input Sanitization** - Markdown renderer sanitizes HTML
