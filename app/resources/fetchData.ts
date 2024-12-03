import axios from 'axios';
import { Resource } from './data';
import { BrowserCache } from '../utils/cache';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DESCRIPTION_MAX_LENGTH = 200;
const RESOURCES_CACHE_KEY = 'resources_cache';
const RESOURCES_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
const RESOURCE_CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  topics: string[];
  language: string | null;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
}

interface GitHubResponse {
  items: GitHubRepo[];
}

function truncateDescription(description: string): string {
  if (!description) return '';
  if (description.length <= DESCRIPTION_MAX_LENGTH) return description;
  
  const lastSpace = description.lastIndexOf(' ', DESCRIPTION_MAX_LENGTH);
  return lastSpace > 0 ? description.slice(0, lastSpace) + '...' : description.slice(0, DESCRIPTION_MAX_LENGTH) + '...';
}

const MAX_RETRIES = 3;
const TARGET_RESOURCES = 600;
const RESOURCES_PER_PAGE = 100;
const PAGES_NEEDED = 2;
const RATE_LIMIT_WAIT = 60000;
const MIN_ACCEPTABLE_RESOURCES = 100;

const SEARCH_CATEGORIES = [
  {
    query: 'stars:>10000 language:javascript framework NOT deprecated NOT archived',
    category: 'Frontend Development'
  },
  {
    query: 'stars:>10000 language:typescript framework NOT deprecated NOT archived',
    category: 'Frontend Development'
  },
  {
    query: 'stars:>5000 language:python web framework NOT deprecated NOT archived',
    category: 'Backend Development'
  },
  {
    query: 'stars:>5000 language:java spring boot NOT deprecated NOT archived',
    category: 'Backend Development'
  },
  {
    query: 'stars:>5000 react-native OR flutter mobile NOT deprecated NOT archived',
    category: 'Mobile Development'
  },
  {
    query: 'stars:>5000 terraform OR ansible devops NOT deprecated NOT archived',
    category: 'DevOps & CI/CD'
  },
  {
    query: 'stars:>5000 kubernetes helm cloud NOT deprecated NOT archived',
    category: 'Cloud Native'
  },
  {
    query: 'stars:>3000 security penetration-testing NOT deprecated NOT archived',
    category: 'Security & Compliance'
  }
];

// Rate limit tracking
let rateLimitResetTime: number | null = null;
let retryCount = 0;

function shouldRetry(error: any): boolean {
  // Check if it's a rate limit error
  return error.response && 
         error.response.status === 403 && 
         error.response.headers['x-ratelimit-remaining'] === '0';
}

function extractRateLimitResetTime(headers: any): number | null {
  const resetTimestamp = headers['x-ratelimit-reset'];
  return resetTimestamp ? parseInt(resetTimestamp, 10) * 1000 : null;
}

async function waitForRateLimitReset() {
  if (!rateLimitResetTime) return;

  const currentTime = Date.now();
  const waitTime = rateLimitResetTime - currentTime;

  if (waitTime > 0) {
    console.log(`Rate limit hit. Waiting until ${new Date(rateLimitResetTime).toLocaleString()}`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
}

async function fetchGithubRepos(query: string, category: string, page: number = 1): Promise<Partial<Resource>[]> {
  try {
    // Wait if we've hit a previous rate limit
    await waitForRateLimitReset();

    const rateLimit = await checkRateLimit();
    if (rateLimit < 2) {
      throw new Error('RATE_LIMIT_REACHED');
    }

    const response = await axios.get<GitHubResponse>('https://api.github.com/search/repositories', {
      params: {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: RESOURCES_PER_PAGE,
        page: page
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Resource-Fetcher'
      }
    });

    await delay(2000);

    // Reset retry count on successful fetch
    retryCount = 0;

    if (!response.data?.items?.length) {
      return [];
    }

    return response.data.items
      .filter(repo => !repo.archived && !repo.disabled && !repo.fork)
      .map(repo => ({
        id: repo.html_url,
        title: repo.name,
        description: truncateDescription(repo.description || `A ${category.toLowerCase()} resource`),
        link: repo.html_url,
        category,
        type: determineResourceType(repo),
        stars: repo.stargazers_count,
        dateAdded: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        tags: [
          ...(repo.topics || []),
          repo.language,
          category.toLowerCase()
        ].filter((tag): tag is string => typeof tag === 'string')
      }));
  } catch (error) {
    // Handle rate limit
    if (axios.isAxiosError(error) && shouldRetry(error)) {
      // Extract reset time from headers
      rateLimitResetTime = extractRateLimitResetTime(error.response?.headers || {});
      
      // Implement exponential backoff
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.log(`Backing off for ${backoffTime}ms. Retry ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // Retry the fetch
        return fetchGithubRepos(query, category, page);
      }
    }

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      if (error.response?.status === 422) {
        console.warn(`Search query too broad: ${query}`);
        return [];
      }
      console.error(`GitHub API error (${error.response?.status}):`, error.response?.data?.message || error.message);
    }
    throw error;
  }
}

async function fetchResourcesWithRetry(): Promise<Resource[]> {
  let allResources: Partial<Resource>[] = [];
  let categoryIndex = 0;

  while (categoryIndex < SEARCH_CATEGORIES.length && allResources.length < TARGET_RESOURCES) {
    const { query, category } = SEARCH_CATEGORIES[categoryIndex];
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
      try {
        for (let page = 1; page <= PAGES_NEEDED; page++) {
          const results = await fetchGithubRepos(query, category, page);
          allResources.push(...results);
        }
        break; // Break retry loop on success
      } catch (error) {
        console.error(`Retry ${retryCount + 1} failed for category ${category}`, error);
        retryCount++;
        if (retryCount >= MAX_RETRIES) {
          console.warn(`Max retries reached for ${category}`);
        }
        await delay(5000);
      }
    }
    categoryIndex++;
  }

  return allResources as Resource[];
}

async function checkRateLimit(): Promise<number> {
  try {
    const response = await axios.get('https://api.github.com/rate_limit');
    return response.data.rate.remaining;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return 0;
  }
}

function determineResourceType(repo: GitHubRepo): Resource['type'] {
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = repo.topics.map(t => t.toLowerCase());

  if (topics.includes('framework') || name.includes('framework') || description.includes('framework')) {
    return 'framework';
  }
  if (topics.includes('library') || name.includes('lib') || description.includes('library')) {
    return 'library';
  }
  return 'tool';
}

export async function fetchAllResources(): Promise<Resource[]> {
  const cache = new BrowserCache();
  try {
    const cachedResources = await cache.get<Resource[]>(RESOURCES_CACHE_KEY);
    if (cachedResources) return cachedResources;

    const resources = await fetchResourcesWithRetry();
    await cache.set(RESOURCES_CACHE_KEY, resources, RESOURCES_CACHE_DURATION);
    return resources;
  } catch (error) {
    console.error('Error in fetchAllResources:', error);
    return [];
  }
}
