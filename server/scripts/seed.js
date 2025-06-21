require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Discussion = require('../models/Discussion');
const Reply = require('../models/Reply');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const BlogPost = require('../models/BlogPost');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Discussion.deleteMany({});
    await Reply.deleteMany({});
    await Resource.deleteMany({});
    await Event.deleteMany({});
    await BlogPost.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    const admin = await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@linuxcommunityhub.org',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
      reputation: 1000,
      stats: {
        postsCount: 5,
        repliesCount: 15,
        likesReceived: 50,
        resourcesShared: 10
      }
    });

    // Create sample users
    const users = await User.create([
      {
        username: 'linuxpro',
        email: 'linuxpro@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Linux',
        lastName: 'Pro',
        bio: 'Linux system administrator with 10+ years of experience',
        isEmailVerified: true,
        reputation: 500,
        stats: {
          postsCount: 25,
          repliesCount: 100,
          likesReceived: 200,
          resourcesShared: 15
        }
      },
      {
        username: 'coder123',
        email: 'coder123@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Code',
        lastName: 'Master',
        bio: 'Full-stack developer passionate about open source',
        isEmailVerified: true,
        reputation: 300,
        stats: {
          postsCount: 15,
          repliesCount: 75,
          likesReceived: 150,
          resourcesShared: 8
        }
      },
      {
        username: 'webdev',
        email: 'webdev@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Web',
        lastName: 'Developer',
        bio: 'Frontend developer learning Linux',
        isEmailVerified: true,
        reputation: 150,
        stats: {
          postsCount: 8,
          repliesCount: 30,
          likesReceived: 80,
          resourcesShared: 5
        }
      }
    ]);

    console.log('👥 Created users');

    // Create categories
    const categories = await Category.create([
      {
        name: 'General Discussion',
        description: 'General Linux and open source discussions',
        icon: 'message-circle',
        color: '#6B7280',
        order: 1
      },
      {
        name: 'Help & Support',
        description: 'Get help with Linux issues and problems',
        icon: 'help-circle',
        color: '#EF4444',
        order: 2
      },
      {
        name: 'System Administration',
        description: 'Server management and system administration',
        icon: 'server',
        color: '#3B82F6',
        order: 3
      },
      {
        name: 'Programming',
        description: 'Programming and development on Linux',
        icon: 'code',
        color: '#8B5CF6',
        order: 4
      },
      {
        name: 'Security',
        description: 'Linux security and hardening discussions',
        icon: 'shield',
        color: '#F59E0B',
        order: 5
      },
      {
        name: 'News & Updates',
        description: 'Latest Linux and open source news',
        icon: 'newspaper',
        color: '#10B981',
        order: 6
      }
    ]);

    console.log('📂 Created categories');

    // Create sample discussions
    const discussions = await Discussion.create([
      {
        title: 'Best practices for securing SSH access',
        content: 'What are the most important security measures when setting up SSH access to a Linux server? I\'m particularly interested in key-based authentication and fail2ban configuration.',
        author: users[0]._id,
        category: categories[4]._id,
        tags: ['ssh', 'security', 'server'],
        views: 1200,
        isPinned: true
      },
      {
        title: 'How to optimize Docker containers on Linux',
        content: 'I\'m running several Docker containers on my Ubuntu server and looking for ways to optimize performance and resource usage. Any tips on container optimization?',
        author: users[1]._id,
        category: categories[2]._id,
        tags: ['docker', 'containers', 'optimization'],
        views: 890
      },
      {
        title: 'Vim vs Neovim in 2024',
        content: 'What are the main differences between Vim and Neovim? Is it worth switching to Neovim for development work?',
        author: users[2]._id,
        category: categories[3]._id,
        tags: ['vim', 'neovim', 'editor'],
        views: 2100
      },
      {
        title: 'Help with systemd service configuration',
        content: 'I\'m trying to create a custom systemd service for my application but it\'s not starting properly. Can someone help me debug the service file?',
        author: users[2]._id,
        category: categories[1]._id,
        tags: ['systemd', 'service', 'help'],
        views: 450
      },
      {
        title: 'Best Linux distro for programming in 2024',
        content: 'I\'m setting up a new development environment and wondering which Linux distribution would be best for programming. Currently considering Ubuntu, Fedora, and Arch.',
        author: users[1]._id,
        category: categories[0]._id,
        tags: ['distro', 'programming', 'development'],
        views: 1800
      }
    ]);

    console.log('💬 Created discussions');

    // Create sample replies
    const replies = await Reply.create([
      {
        content: 'Great question! I always start with disabling password authentication and using key-based auth only. Also, changing the default SSH port helps reduce automated attacks.',
        author: admin._id,
        discussion: discussions[0]._id
      },
      {
        content: 'Don\'t forget about fail2ban! It\'s essential for blocking repeated failed login attempts. I also recommend using SSH certificates for larger deployments.',
        author: users[1]._id,
        discussion: discussions[0]._id
      },
      {
        content: 'For Docker optimization, start by using multi-stage builds to reduce image size. Also, make sure you\'re using .dockerignore files properly.',
        author: users[0]._id,
        discussion: discussions[1]._id
      },
      {
        content: 'Neovim has better plugin architecture and built-in LSP support. If you\'re doing serious development, I\'d recommend making the switch.',
        author: admin._id,
        discussion: discussions[2]._id
      },
      {
        content: 'Can you share your service file? Common issues are usually related to file permissions or incorrect ExecStart paths.',
        author: users[0]._id,
        discussion: discussions[3]._id
      }
    ]);

    // Update discussions with replies
    for (let i = 0; i < discussions.length; i++) {
      const discussionReplies = replies.filter(reply => 
        reply.discussion.toString() === discussions[i]._id.toString()
      );
      
      if (discussionReplies.length > 0) {
        discussions[i].replies = discussionReplies.map(reply => reply._id);
        discussions[i].lastReply = discussionReplies[discussionReplies.length - 1]._id;
        discussions[i].lastActivity = new Date();
        await discussions[i].save();
      }
    }

    console.log('💭 Created replies');

    // Create sample resources
    const resources = await Resource.create([
      {
        title: 'htop',
        description: 'An interactive process viewer for Unix systems. A better alternative to top.',
        url: 'https://github.com/htop-dev/htop',
        category: 'System Tools',
        type: 'tool',
        tags: ['monitoring', 'system', 'cli'],
        submittedBy: admin._id,
        isApproved: true,
        approvedBy: admin._id,
        approvedAt: new Date(),
        githubData: {
          stars: 5800,
          forks: 450,
          language: 'C'
        }
      },
      {
        title: 'Docker',
        description: 'Platform for developing, shipping, and running applications using containerization.',
        url: 'https://github.com/docker/docker-ce',
        category: 'Development Tools',
        type: 'platform',
        tags: ['containers', 'virtualization', 'deployment'],
        submittedBy: users[0]._id,
        isApproved: true,
        approvedBy: admin._id,
        approvedAt: new Date(),
        githubData: {
          stars: 25000,
          forks: 5000,
          language: 'Go'
        }
      },
      {
        title: 'Nginx',
        description: 'High-performance HTTP server and reverse proxy.',
        url: 'https://github.com/nginx/nginx',
        category: 'Backend Development',
        type: 'tool',
        tags: ['web-server', 'proxy', 'performance'],
        submittedBy: users[1]._id,
        isApproved: true,
        approvedBy: admin._id,
        approvedAt: new Date(),
        githubData: {
          stars: 18000,
          forks: 6000,
          language: 'C'
        }
      }
    ]);

    console.log('🔧 Created resources');

    // Create sample events
    const events = await Event.create([
      {
        title: 'Linux Security Workshop',
        description: 'Learn about Linux security best practices, including system hardening, firewall configuration, and intrusion detection.',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
        location: 'Online',
        isOnline: true,
        meetingLink: 'https://meet.example.com/linux-security',
        organizer: admin._id,
        speakers: [
          {
            name: 'John Security',
            bio: 'Cybersecurity expert with 15+ years experience',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            social: {
              twitter: '@johnsecurity',
              linkedin: 'linkedin.com/in/johnsecurity'
            }
          }
        ],
        agenda: [
          {
            time: '10:00 AM',
            title: 'Introduction to Linux Security',
            description: 'Overview of common security threats and vulnerabilities',
            speaker: 'John Security'
          },
          {
            time: '11:00 AM',
            title: 'System Hardening Techniques',
            description: 'Practical steps to secure your Linux system',
            speaker: 'John Security'
          }
        ],
        maxAttendees: 100,
        tags: ['security', 'workshop', 'online'],
        status: 'published'
      },
      {
        title: 'Open Source Contribution Hackathon',
        description: 'Join us for a weekend hackathon focused on contributing to open source projects. All skill levels welcome!',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 2 days later
        location: 'Tech Hub Downtown',
        isOnline: false,
        organizer: admin._id,
        speakers: [
          {
            name: 'Sarah OpenSource',
            bio: 'Maintainer of several popular open source projects',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
          }
        ],
        maxAttendees: 50,
        tags: ['hackathon', 'open-source', 'coding'],
        status: 'published'
      }
    ]);

    console.log('📅 Created events');

    // Create sample blog posts
    const blogPosts = await BlogPost.create([
      {
        title: 'Getting Started with Linux System Administration',
        slug: 'getting-started-linux-system-administration',
        excerpt: 'Essential tips and best practices for beginning Linux system administrators.',
        content: `
# Getting Started with Linux System Administration

Linux system administration is a rewarding career path that offers excellent job prospects and the opportunity to work with cutting-edge technology. Whether you're just starting out or looking to formalize your existing knowledge, this guide will help you understand the fundamentals.

## Essential Skills

### Command Line Mastery
The command line is your primary tool as a Linux administrator. Start with these essential commands:
- \`ls\`, \`cd\`, \`pwd\` for navigation
- \`grep\`, \`find\`, \`locate\` for searching
- \`ps\`, \`top\`, \`htop\` for process management
- \`systemctl\` for service management

### File System Understanding
Learn about:
- File permissions and ownership
- Directory structure (/etc, /var, /usr, etc.)
- Mount points and file systems
- Backup and recovery strategies

## Next Steps

1. Set up a home lab with virtual machines
2. Practice with different distributions
3. Learn configuration management tools
4. Study for Linux certifications

Remember, the best way to learn is by doing. Don't be afraid to break things in your test environment!
        `,
        author: admin._id,
        category: 'System Administration',
        tags: ['beginner', 'sysadmin', 'tutorial'],
        status: 'published',
        publishedAt: new Date(),
        views: 1500,
        readTime: 8,
        isEditorsPick: true
      },
      {
        title: 'Docker Best Practices for Production',
        slug: 'docker-best-practices-production',
        excerpt: 'Learn how to deploy and manage Docker containers in production environments safely and efficiently.',
        content: `
# Docker Best Practices for Production

Running Docker in production requires careful planning and adherence to best practices. Here's what you need to know.

## Security Considerations

### Use Official Images
Always start with official images from Docker Hub when possible. They're regularly updated and security-scanned.

### Run as Non-Root
Never run containers as root unless absolutely necessary:
\`\`\`dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
\`\`\`

### Scan for Vulnerabilities
Use tools like \`docker scan\` or \`trivy\` to check for known vulnerabilities.

## Performance Optimization

### Multi-stage Builds
Use multi-stage builds to reduce image size:
\`\`\`dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
\`\`\`

### Resource Limits
Always set resource limits:
\`\`\`yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
\`\`\`

## Monitoring and Logging

Implement proper logging and monitoring from day one. Use centralized logging solutions and monitor container health.
        `,
        author: users[0]._id,
        category: 'Containers',
        tags: ['docker', 'production', 'devops'],
        status: 'published',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        views: 2300,
        readTime: 12
      }
    ]);

    console.log('📝 Created blog posts');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length + 1} (including admin)`);
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`💬 Discussions: ${discussions.length}`);
    console.log(`💭 Replies: ${replies.length}`);
    console.log(`🔧 Resources: ${resources.length}`);
    console.log(`📅 Events: ${events.length}`);
    console.log(`📝 Blog Posts: ${blogPosts.length}`);
    console.log('\n🔑 Admin Credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();