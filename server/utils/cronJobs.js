const cron = require('node-cron');
const axios = require('axios');
const Parser = require('rss-parser');
const News = require('../models/News');
const Resource = require('../models/Resource');

const parser = new Parser();

// News sources configuration
const NEWS_SOURCES = [
  {
    name: "It's FOSS",
    url: 'https://itsfoss.com/feed/',
    category: 'FOSS',
    priority: 1
  },
  {
    name: 'Linux Today',
    url: 'https://www.linuxtoday.com/feed/',
    category: 'Linux',
    priority: 1
  },
  {
    name: 'OMG Ubuntu',
    url: 'https://www.omgubuntu.co.uk/feed',
    category: 'Linux',
    priority: 1
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'Tech',
    priority: 2
  }
];

// Fetch news from RSS feeds
const fetchNewsFromRSS = async () => {
  console.log('🗞️ Starting news fetch...');
  
  for (const source of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      
      for (const item of feed.items.slice(0, 10)) { // Limit to 10 latest items
        const newsData = {
          title: item.title,
          description: item.contentSnippet || item.content || '',
          url: item.link,
          source: {
            id: null,
            name: source.name
          },
          author: item.creator || item.author || '',
          urlToImage: item.enclosure?.url || '',
          publishedAt: new Date(item.pubDate || item.isoDate),
          category: source.category,
          sourcePriority: source.priority
        };

        // Check if news already exists
        const existingNews = await News.findOne({ url: newsData.url });
        if (!existingNews) {
          await News.create(newsData);
          console.log(`📰 Added news: ${newsData.title}`);
        }
      }
    } catch (error) {
      console.error(`Error fetching news from ${source.name}:`, error.message);
    }
  }
  
  console.log('✅ News fetch completed');
};

// Fetch GitHub resources
const fetchGitHubResources = async () => {
  console.log('🔧 Starting GitHub resources fetch...');
  
  const categories = [
    'linux tools',
    'system administration',
    'devops tools',
    'security tools'
  ];

  for (const category of categories) {
    try {
      const response = await axios.get('https://api.github.com/search/repositories', {
        params: {
          q: `${category} stars:>100 NOT archived`,
          sort: 'stars',
          order: 'desc',
          per_page: 20
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Linux-Community-Hub',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      });

      for (const repo of response.data.items) {
        const resourceData = {
          title: repo.name,
          description: repo.description || `A ${category} resource`,
          url: repo.html_url,
          category: 'Development Tools',
          type: 'tool',
          tags: repo.topics || [],
          githubData: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            lastUpdated: new Date(repo.updated_at)
          },
          isApproved: true,
          lastChecked: new Date()
        };

        // Check if resource already exists
        const existingResource = await Resource.findOne({ url: resourceData.url });
        if (!existingResource) {
          await Resource.create(resourceData);
          console.log(`🔧 Added resource: ${resourceData.title}`);
        } else {
          // Update GitHub data
          await Resource.findByIdAndUpdate(existingResource._id, {
            githubData: resourceData.githubData,
            lastChecked: new Date()
          });
        }
      }

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error fetching GitHub resources for ${category}:`, error.message);
    }
  }
  
  console.log('✅ GitHub resources fetch completed');
};

// Clean up old news (keep only last 30 days)
const cleanupOldNews = async () => {
  console.log('🧹 Cleaning up old news...');
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  try {
    const result = await News.deleteMany({
      publishedAt: { $lt: thirtyDaysAgo }
    });
    
    console.log(`🗑️ Deleted ${result.deletedCount} old news articles`);
  } catch (error) {
    console.error('Error cleaning up old news:', error);
  }
};

// Start all cron jobs
const startCronJobs = () => {
  console.log('⏰ Starting cron jobs...');

  // Fetch news every 2 hours
  cron.schedule('0 */2 * * *', fetchNewsFromRSS);

  // Fetch GitHub resources every 6 hours
  cron.schedule('0 */6 * * *', fetchGitHubResources);

  // Clean up old news daily at 2 AM
  cron.schedule('0 2 * * *', cleanupOldNews);

  // Initial fetch on startup (with delay)
  setTimeout(() => {
    fetchNewsFromRSS();
    fetchGitHubResources();
  }, 5000);

  console.log('✅ Cron jobs started');
};

module.exports = { startCronJobs, fetchNewsFromRSS, fetchGitHubResources };