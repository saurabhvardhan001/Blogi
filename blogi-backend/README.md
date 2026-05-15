# Blogi — AI-Powered Blog Generator

A full-stack app (Spring Boot + MySQL + React) that generates SEO-optimized blog posts using Azure OpenAI.

## Backend (Spring Boot)

### Build & Run
1. Create MySQL DB `blogi` and update credentials in `src/main/resources/application.properties`.
2. Set environment variables (recommended):
   ```bash
   export AZURE_OPENAI_KEY=YOUR_KEY
   export AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
   export AZURE_OPENAI_DEPLOYMENT=gpt-4o
   export AZURE_OPENAI_API_VERSION=2025-01-01-preview
   export JWT_SECRET=change_this
   ```
3. (Optional) Alternatively, edit `application.properties` placeholders.
4. Build & run:
   ```bash
   mvn spring-boot:run
   ```

### API (test via Postman)
- `POST /api/auth/register` — { username, email, password }
- `POST /api/auth/login` — { username, password } → returns JWT
- `POST /api/blog/generate` — Authorization: Bearer <token>, body: { topic, keywords[], tone, targetAudience, length }
- `GET /api/blog` — list posts
- `GET /api/blog/{id}` — get post

## Frontend (React + Vite + MUI)

1. `cd blogi-frontend`
2. Copy `.env.sample` to `.env` and set `VITE_API_BASE_URL` (e.g., `http://localhost:8080`).
3. `npm install`
4. `npm run dev`
