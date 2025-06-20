# SkillMatch

SkillMatch is a job portal API that connects job seekers and recruiters, allowing users to register, search and apply for jobs, manage applications, and more. It supports both traditional email/password and Google OAuth authentication, resume uploads, and robust admin controls.

---

## Features

### Authentication & User Management
- **Register/Login** with email/password or Google OAuth
- **JWT-based authentication** for protected endpoints
- **User roles:** Seeker, Recruiter, Admin
- **Profile management:** View and update profile, upload multiple resumes (PDF/image, up to 9 per user)
- **Ban/unban users** (admin only)

### Job Management
- **Create, update, delete jobs** (recruiters)
- **List all open jobs** with optional filters (type, keyword search, sorting)
- **View job details**
- **Keyword search** across job title, description, company, location, tags, and type
- **List jobs posted by a recruiter**

### Application Management
- **Apply to jobs** (seekers, with optional resume upload)
- **List your own applications** (seekers)
- **Recruiter can view all applications** for their jobs
- **Recruiter can update application status** (applied, shortlisted, rejected)

### Admin Controls
- **List all users** (with optional role filter, pagination)
- **Ban/unban users**
- **List all jobs** (site-wide, with optional status filter, pagination)
- **Delete jobs** (hard delete for spam/scam)

### Security & Middleware
- **Role-based access control** for all endpoints
- **Rate limiting, CORS, Helmet** for security
- **File upload validation** (PDF/images only, via Cloudinary)
- **Error handling** with consistent JSON responses

---

## API Endpoints

See `apidoc.txt` for full request/response details. Here's a summary:

### Auth
- `POST /auth/register` — Register user
- `POST /auth/login` — Login user
- `GET /auth/google` — Google OAuth login
- `GET /auth/google/callback` — Google OAuth callback

### Users
- `GET /users/me` — Get profile
- `PUT /users/me` — Update profile
- `POST /users/me/resume` — Upload resume

### Jobs
- `GET /jobs` — List jobs (with filters)
- `GET /jobs/:id` — Get job details
- `POST /jobs` — Create job (recruiter)
- `PUT /jobs/:id` — Update job (recruiter)
- `DELETE /jobs/:id` — Delete job (recruiter)
- `GET /jobs/search` — Keyword search

### Applications
- `POST /jobs/:jobId/apply` — Apply to job (seeker)
- `GET /applications/me` — List my applications (seeker)
- `PUT /applications/:appId/status` — Update application status (recruiter)
- `GET /applications/job/:jobId` — List applications for a job (recruiter)

### Admin
- `GET /admin/users` — List users
- `PUT /admin/users/:id/ban` — Ban/unban user
- `GET /admin/jobs` — List jobs
- `DELETE /admin/jobs/:id` — Delete job

---

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd SkillMatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   - Create a `.env` file in the root with:
     ```
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     CLOUDINARY_CLOUD_NAME=<cloudinary-name>
     CLOUDINARY_API_KEY=<cloudinary-key>
     CLOUDINARY_API_SECRET=<cloudinary-secret>
     FRONTEND_URL=<your-frontend-url>
     ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000/api`

---

## Testing

- Run tests with:
  ```bash
  npm test
  ```

---

## Tech Stack

- Node.js, Express.js
- MongoDB, Mongoose
- JWT, Passport.js (Google OAuth)
- Cloudinary (file uploads)
- Multer (file parsing)
- Jest, Supertest (testing)
- Helmet, CORS, Rate Limiting (security)

---

## License

ISC

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change. 