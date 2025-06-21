# Linux Community Hub Backend

A comprehensive backend API for the Linux Community Hub platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Forum System** - Discussions, replies, categories with real-time updates
- **Resource Management** - Curated resources with GitHub integration
- **News Aggregation** - Automated news fetching from RSS feeds
- **Event Management** - Create and manage community events
- **Blog System** - Content management for blog posts
- **Contribution System** - Handle volunteer applications
- **Real-time Features** - Socket.IO for live updates
- **Email System** - Automated emails for notifications
- **Caching** - Redis for session management and caching
- **Security** - Rate limiting, input validation, and security headers

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Caching**: Redis
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer with Cloudinary
- **Cron Jobs**: Node-cron for automated tasks

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- SMTP server for emails (Gmail recommended)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd server
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/linux-community-hub

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@linuxcommunityhub.org
FROM_NAME=Linux Community Hub

# Redis
REDIS_URL=redis://localhost:6379

# GitHub (optional, for resource fetching)
GITHUB_TOKEN=your-github-token

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@linuxcommunityhub.org
ADMIN_PASSWORD=admin123
```

### 3. Database Setup

Seed the database with sample data:

```bash
npm run seed
```

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Request password reset |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/logout` | Logout user |

### Forum Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/discussions` | Get all discussions |
| GET | `/api/discussions/:id` | Get single discussion |
| POST | `/api/discussions` | Create discussion |
| PUT | `/api/discussions/:id` | Update discussion |
| DELETE | `/api/discussions/:id` | Delete discussion |
| POST | `/api/discussions/:id/like` | Like/unlike discussion |
| POST | `/api/discussions/:id/replies` | Add reply |
| PATCH | `/api/discussions/:id/pin` | Pin/unpin discussion |
| PATCH | `/api/discussions/:id/lock` | Lock/unlock discussion |

### Resource Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | Get all resources |
| GET | `/api/resources/:id` | Get single resource |
| POST | `/api/resources` | Submit resource |
| PUT | `/api/resources/:id` | Update resource |
| DELETE | `/api/resources/:id` | Delete resource |
| POST | `/api/resources/:id/like` | Like/unlike resource |

### News Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | Get all news |
| GET | `/api/news/:id` | Get single news |
| POST | `/api/news/:id/like` | Like/unlike news |

### Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| POST | `/api/events/:id/register` | Register for event |
| DELETE | `/api/events/:id/register` | Unregister from event |

### Blog Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog` | Get all blog posts |
| GET | `/api/blog/:slug` | Get single blog post |
| POST | `/api/blog` | Create blog post |
| PUT | `/api/blog/:id` | Update blog post |
| DELETE | `/api/blog/:id` | Delete blog post |
| POST | `/api/blog/:id/like` | Like/unlike blog post |

## 🔧 Features in Detail

### Authentication System
- JWT-based authentication
- Role-based access control (user, moderator, admin)
- Email verification
- Password reset functionality
- Session management with Redis

### Forum System
- Hierarchical discussions with replies
- Category-based organization
- Real-time updates via Socket.IO
- Like/unlike functionality
- Moderation tools (pin, lock, delete)
- Search functionality

### Resource Management
- GitHub integration for automatic resource discovery
- Manual resource submission
- Approval workflow
- Category and tag-based filtering
- Like and view tracking

### News Aggregation
- Automated RSS feed parsing
- Multiple news sources
- Category-based organization
- Duplicate detection
- Automatic cleanup of old articles

### Event Management
- Event creation and management
- Registration system
- Speaker and agenda management
- Photo galleries for past events
- Email notifications

### Real-time Features
- Live discussion updates
- Real-time notifications
- User presence indicators
- Instant messaging (planned)

### Email System
- Welcome emails
- Password reset emails
- Event notifications
- Contribution confirmations
- Newsletter (planned)

### Security Features
- Rate limiting
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- Password hashing with bcrypt
- JWT token validation

## 🔄 Automated Tasks

The system includes several automated tasks:

- **News Fetching**: Every 2 hours
- **Resource Discovery**: Every 6 hours  
- **Data Cleanup**: Daily at 2 AM
- **Email Queue Processing**: Continuous

## 📊 Database Schema

### User Model
- Authentication and profile information
- Role-based permissions
- Statistics and reputation system
- Preferences and settings

### Discussion Model
- Forum discussions with metadata
- Category association
- Like and view tracking
- Moderation flags

### Reply Model
- Threaded replies to discussions
- Edit history tracking
- Like system

### Resource Model
- Curated development resources
- GitHub integration data
- Approval workflow
- Category and tag system

### Event Model
- Community events
- Registration system
- Speaker and agenda management
- Photo galleries

### News Model
- Aggregated news articles
- Source tracking
- Category organization

## 🚀 Deployment

### Docker Deployment

1. Build the image:
```bash
docker build -t linux-community-backend .
```

2. Run with docker-compose:
```bash
docker-compose up -d
```

### Manual Deployment

1. Install dependencies:
```bash
npm install --production
```

2. Set environment variables
3. Start the application:
```bash
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongo-host:27017/linux-community-hub
REDIS_URL=redis://your-redis-host:6379
JWT_SECRET=your-production-jwt-secret
# ... other production configs
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📈 Monitoring

The application includes:
- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error tracking and logging
- Performance monitoring (planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Advanced search with Elasticsearch
- [ ] Mobile app API
- [ ] AI-powered content recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Plugin system for extensions