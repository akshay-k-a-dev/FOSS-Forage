import axios from 'axios';
import { BrowserCache } from '../utils/cache';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXML = promisify(parseString);

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: {
    id: string | null;
    name: string;
  };
  publishedAt: string;
  urlToImage?: string;
  author?: string;
  category: string;
  sourcePriority: number;
}

interface RSSItem {
  title: string[];
  link: string[];
  description?: string[];
  pubDate?: string[];
  'dc:creator'?: string[];
  creator?: string[];
  author?: string[];
  guid?: string[];
}

interface RSSFeed {
  rss?: {
    channel: Array<{
      item: RSSItem[];
    }>;
  };
}

interface AtomFeed {
  feed?: {
    entry: RSSItem[];
  };
}

const NEWS_SOURCES = {
  LINUX_FOSS: [
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
    }
  ],
  TECH_NEWS: [
    {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      category: 'Tech',
      priority: 2
    },
    {
      name: 'Wired',
      url: 'https://www.wired.com/feed/rss',
      category: 'Tech',
      priority: 2
    }
  ]
};

const NEWS_CACHE_KEY = 'news_cache';
const NEWS_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

function parseDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  
  const fallbackDate = new Date().toISOString();
  
  try {
    // First try parsing as ISO date
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) {
      return isoDate.toISOString();
    }

    // Try parsing RFC 822/2822 format (common in RSS)
    const pubDate = new Date(dateStr.replace(/([+-]\d{4})/, ' UTC$1'));
    if (!isNaN(pubDate.getTime())) {
      return pubDate.toISOString();
    }

    // Try parsing other common formats
    const formats = [
      // Wed, 02 Oct 2002 13:00:00 GMT
      /^\w+, \d{2} \w+ \d{4} \d{2}:\d{2}:\d{2} \w+$/,
      // 2002-10-02T13:00:00
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
    ];

    for (const format of formats) {
      if (format.test(dateStr)) {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
      }
    }

    return fallbackDate;
  } catch {
    return fallbackDate;
  }
}

async function fetchFeed(source: typeof NEWS_SOURCES.LINUX_FOSS[0]): Promise<NewsArticle[]> {
  try {
    const response = await axios.get(source.url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)'
      },
      timeout: 15000, // Increased timeout
      maxRedirects: 5
    });

    console.log(`Fetched from ${source.name}: Status ${response.status}`);

    const result: any = await parseXML(response.data);
    let items: any[] = [];

    // Handle different RSS feed formats
    if (result?.rss?.channel?.[0]?.item) {
      items = result.rss.channel[0].item;
    } else if (result?.feed?.entry) {
      items = result.feed.entry;
    } else if (result?.rdf?.item) {
      items = result.rdf.item;
    }

    items = items.filter(Boolean);

    if (items.length === 0) {
      console.warn(`No items found in feed for ${source.name}`);
    }

    return items.map((item: any) => ({
      id: item.guid?.[0] || item.link?.[0] || item.id?.[0] || '',
      title: Array.isArray(item.title) ? item.title[0] : item.title || 'No Title',
      description: (Array.isArray(item.description) ? item.description[0] : item.description || '')
        .replace(/<[^>]*>/g, '')
        .trim() || 'No description available',
      url: Array.isArray(item.link) ? item.link[0] : item.link || '',
      source: {
        id: null,
        name: source.name
      },
      publishedAt: parseDate(item.pubDate?.[0] || item.published?.[0] || item.updated?.[0]),
      author: item['dc:creator']?.[0] || item.creator?.[0] || item.author?.[0] || '',
      category: source.category,
      sourcePriority: source.priority
    })).filter(article => article.url && article.title);
  } catch (error) {
    console.error(`Error fetching feed from ${source.name}:`, error);
    return [];
  }
}

async function fetchAllArticles(): Promise<NewsArticle[]> {
  const allSources = [...NEWS_SOURCES.LINUX_FOSS, ...NEWS_SOURCES.TECH_NEWS];
  const results = await Promise.allSettled(
    allSources.map(async source => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const articles = await fetchFeed(source);
          if (articles.length === 0) {
            console.warn(`No articles fetched from ${source.name}`);
          }
          return articles;
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed for ${source.name}:`, error);
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
          }
        }
      }
      return [];
    })
  );

  const allNews = results.flatMap(result => 
    result.status === 'fulfilled' ? result.value : []
  );

  // Log source distribution
  const sourceDistribution = allNews.reduce((acc, article) => {
    acc[article.source.name] = (acc[article.source.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('News source distribution:', sourceDistribution);

  const uniqueNews = removeDuplicateNews(allNews);
  const sortedNews = uniqueNews.sort((a, b) => {
    // First sort by source priority
    if (a.sourcePriority !== b.sourcePriority) {
      return a.sourcePriority - b.sourcePriority;
    }
    // Then by date
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return sortedNews;
}

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const cache = new BrowserCache();
    const cachedNews = await cache.get<NewsArticle[]>(NEWS_CACHE_KEY);
    
    if (cachedNews && cachedNews.length > 0) {
      // Check if we have articles from all sources
      const sourceNames = new Set(cachedNews.map(article => article.source.name));
      const allSourceNames = [...NEWS_SOURCES.LINUX_FOSS, ...NEWS_SOURCES.TECH_NEWS].map(s => s.name);
      
      if (sourceNames.size === allSourceNames.length) {
        return cachedNews;
      }
    }

    const articles = await fetchAllArticles();
    if (articles.length > 0) {
      await cache.set(NEWS_CACHE_KEY, articles, NEWS_CACHE_DURATION);
    }
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    const cache = new BrowserCache();
    const fallback = await cache.get<NewsArticle[]>(NEWS_CACHE_KEY);
    return fallback || [];
  }
}

function removeDuplicateNews(news: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return news.filter(article => {
    const key = article.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
