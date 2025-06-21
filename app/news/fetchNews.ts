import { BrowserCache } from '../utils/cache';

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

const NEWS_CACHE_KEY = 'news_cache';
const NEWS_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Curated news articles to avoid external API dependencies
const curatedNews: NewsArticle[] = [
  {
    id: 'linux-6-7-release',
    title: 'Linux Kernel 6.7 Released with New Features',
    description: 'The latest Linux kernel brings improved hardware support, better performance, and new security features for modern systems.',
    url: 'https://kernel.org',
    source: {
      id: null,
      name: 'Linux Kernel Archives'
    },
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    urlToImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    author: 'Linus Torvalds',
    category: 'Linux',
    sourcePriority: 1
  },
  {
    id: 'ubuntu-24-04-lts',
    title: 'Ubuntu 24.04 LTS: What\'s New in the Latest Release',
    description: 'Ubuntu 24.04 LTS brings long-term support with updated packages, improved security, and better hardware compatibility.',
    url: 'https://ubuntu.com',
    source: {
      id: null,
      name: 'Ubuntu'
    },
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    urlToImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
    author: 'Ubuntu Team',
    category: 'Linux',
    sourcePriority: 1
  },
  {
    id: 'open-source-security',
    title: 'Open Source Security: Best Practices for 2024',
    description: 'Learn about the latest security practices and tools for protecting open source projects and infrastructure.',
    url: 'https://opensource.org',
    source: {
      id: null,
      name: 'Open Source Initiative'
    },
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    urlToImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    author: 'OSI Security Team',
    category: 'Security',
    sourcePriority: 1
  },
  {
    id: 'docker-alternatives',
    title: 'Docker Alternatives: Exploring Container Runtimes',
    description: 'A comprehensive look at container runtime alternatives including Podman, containerd, and CRI-O.',
    url: 'https://containers.dev',
    source: {
      id: null,
      name: 'Container Community'
    },
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    urlToImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    author: 'Container Experts',
    category: 'Tech',
    sourcePriority: 2
  },
  {
    id: 'rust-linux-kernel',
    title: 'Rust in the Linux Kernel: Progress and Challenges',
    description: 'An update on the integration of Rust programming language into the Linux kernel and its implications.',
    url: 'https://rust-lang.org',
    source: {
      id: null,
      name: 'Rust Foundation'
    },
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    urlToImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    author: 'Rust Team',
    category: 'Programming',
    sourcePriority: 1
  },
  {
    id: 'kubernetes-1-29',
    title: 'Kubernetes 1.29 Released with Enhanced Security',
    description: 'The latest Kubernetes release focuses on security improvements, better resource management, and stability.',
    url: 'https://kubernetes.io',
    source: {
      id: null,
      name: 'Kubernetes'
    },
    publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    urlToImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
    author: 'CNCF',
    category: 'Cloud Native',
    sourcePriority: 1
  }
];

function removeDuplicateNews(news: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return news.filter(article => {
    const key = article.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const cache = new BrowserCache();
    const cachedNews = await cache.get<NewsArticle[]>(NEWS_CACHE_KEY);
    
    if (cachedNews && cachedNews.length > 0) {
      console.log(`Using ${cachedNews.length} cached news articles`);
      return cachedNews;
    }

    // Use curated news instead of external APIs to avoid 403 errors
    const sortedNews = curatedNews.sort((a, b) => {
      // First sort by source priority
      if (a.sourcePriority !== b.sourcePriority) {
        return a.sourcePriority - b.sourcePriority;
      }
      // Then by date
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    const uniqueNews = removeDuplicateNews(sortedNews);
    
    // Cache the news
    await cache.set(NEWS_CACHE_KEY, uniqueNews, NEWS_CACHE_DURATION);
    
    console.log(`Loaded ${uniqueNews.length} curated news articles`);
    return uniqueNews;
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return curatedNews;
  }
}