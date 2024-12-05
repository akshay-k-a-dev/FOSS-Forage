import axios from 'axios';
import { Resource, fallbackResources } from './data';
import { BrowserCache } from '../utils/cache';
import { loadStoredResources, appendResources, getResourceCount, delay } from '../utils/persistentStorage';

const DESCRIPTION_MAX_LENGTH = 200;
const RESOURCES_CACHE_KEY = 'resources_cache';
const RESOURCES_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
const RESOURCE_CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
const MAX_RETRIES = 5; // Maximum number of retry attempts
const TARGET_RESOURCES = 600;
const RESOURCES_PER_PAGE = 100;
const FETCH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_CHECK_INTERVAL = 60 * 1000; // 1 minute

// Custom repository to always include
const CUSTOM_REPO = {
  html_url: 'https://github.com/akshay-k-a-dev/coldfetch',
  name: 'coldfetch',
  description: 'A system information fetcher for Linux written in C',
  stargazers_count: 0,
  topics: ['linux', 'system-info', 'c'],
  language: 'C',
  archived: false,
  disabled: false,
  fork: false
};

let isInitialFetch = true;
let existingResources: Set<string> = new Set();

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

interface SourceConfig {
  name: string;
  url: string;
  transform: (data: any) => Resource[];
}

const SOURCES: SourceConfig[] = [
  {
    name: 'GitLab',
    url: 'https://gitlab.com/api/v4/projects?visibility=public&order_by=stars&sort=desc&per_page=100',
    transform: (data: any[]): Resource[] => data.map(project => ({
      id: project.web_url,
      title: project.name,
      description: truncateDescription(project.description || 'A GitLab project'),
      link: project.web_url,
      url: project.web_url,
      category: determineCategory(project),
      type: determineResourceType({ name: project.name, topics: project.topics || [] } as GitHubRepo),
      stars: project.star_count,
      dateAdded: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      tags: project.topics || []
    }))
  },
  {
    name: 'F-Droid',
    url: 'https://f-droid.org/api/v1/packages',
    transform: (data: any): Resource[] => data.packages.map((app: any) => ({
      id: `fdroid-${app.packageName}`,
      title: app.name,
      description: truncateDescription(app.summary || 'An F-Droid application'),
      link: `https://f-droid.org/packages/${app.packageName}/`,
      url: `https://f-droid.org/packages/${app.packageName}/`,
      category: 'Mobile Development',
      type: 'app',
      stars: 0,
      dateAdded: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      tags: app.categories || []
    }))
  },
  {
    name: 'OpenLibrary',
    url: 'https://openlibrary.org/search.json?q=open+source&limit=100',
    transform: (data: any): Resource[] => data.docs.map((book: any) => ({
      id: `openlibrary-${book.key}`,
      title: book.title,
      description: truncateDescription(book.description || 'An open source book'),
      link: `https://openlibrary.org${book.key}`,
      url: `https://openlibrary.org${book.key}`,
      category: 'Documentation',
      type: 'book',
      stars: 0,
      dateAdded: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      tags: book.subject || []
    }))
  }
];

function determineCategory(project: any): string {
  const name = project.name.toLowerCase();
  const description = (project.description || '').toLowerCase();
  
  if (name.includes('frontend') || description.includes('frontend')) return 'Frontend Development';
  if (name.includes('backend') || description.includes('backend')) return 'Backend Development';
  if (name.includes('mobile') || description.includes('mobile')) return 'Mobile Development';
  if (name.includes('ai') || description.includes('machine learning')) return 'AI & Machine Learning';
  return 'Development Tools';
}

function truncateDescription(description: string): string {
  if (!description) return '';
  if (description.length <= DESCRIPTION_MAX_LENGTH) return description;
  
  const lastSpace = description.lastIndexOf(' ', DESCRIPTION_MAX_LENGTH);
  return lastSpace > 0 ? description.slice(0, lastSpace) + '...' : description.slice(0, DESCRIPTION_MAX_LENGTH) + '...';
}

async function fetchGithubRepos(category: string, page: number = 1, query?: string): Promise<Resource[]> {
  try {
    // Wait if we've hit a previous rate limit
    await waitForRateLimitReset();

    // Construct search query based on category and optional query
    const searchQuery = query 
      ? `${query} ${category}`.split(' ').join('+')
      : category.split(' ').join('+');
      
    const response = await axios.get<{ items: GitHubRepo[] }>('https://api.github.com/search/repositories', {
      params: {
        q: `${searchQuery} stars:>100 NOT archived`,
        sort: 'stars',
        order: 'desc',
        per_page: 100,
        page: page
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Resource-Fetcher'
      }
    });

    await delay(2000);

    // Reset retry count on successful fetch
    let retryCount = 0;

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
        url: repo.html_url,
        category,
        type: determineResourceType(repo),
        stars: repo.stargazers_count,
        dateAdded: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        tags: repo.topics || []
      }));
  } catch (error) {
    // Handle rate limit
    if (axios.isAxiosError(error) && shouldRetry(error)) {
      // Extract reset time from headers
      let rateLimitResetTime: number | null = extractRateLimitResetTime(error.response?.headers || {});
      
      let retryCount = 0;  
      // Implement exponential backoff
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.log(`Backing off for ${backoffTime}ms. Retry ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // Retry the fetch
        return fetchGithubRepos(category, page, query);
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

async function fetchFromSource(source: SourceConfig): Promise<Resource[]> {
  try {
    const response = await axios.get(source.url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Resource-Fetcher'
      },
      timeout: 10000
    });
    
    return source.transform(response.data);
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
    return [];
  }
}

async function fetchFromMultipleSources(): Promise<Resource[]> {
  try {
    const results = await Promise.all([
      ...SOURCES.map(source => fetchFromSource(source)),
      fetchGithubRepos('Development Tools') // Keep existing GitHub fetching
    ]);
    
    return results.flat().filter(resource => !existingResources.has(resource.id));
  } catch (error) {
    console.error('Error fetching from multiple sources:', error);
    return [];
  }
}

async function fetchResourcesWithRetry(): Promise<Resource[]> {
  let allResources: Resource[] = [];
  let retryCount = 0;
  let hasRateLimitError = false;

  // Add custom repository first
  const customResource = {
    id: CUSTOM_REPO.html_url,
    title: CUSTOM_REPO.name,
    description: truncateDescription(CUSTOM_REPO.description),
    link: CUSTOM_REPO.html_url,
    url: CUSTOM_REPO.html_url,
    category: 'System Tools',
    type: 'tool' as const,
    stars: CUSTOM_REPO.stargazers_count,
    dateAdded: new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    tags: CUSTOM_REPO.topics
  };
  allResources.push(customResource);
  existingResources.add(customResource.id);

  while (retryCount < MAX_RETRIES && allResources.length < TARGET_RESOURCES) {
    try {
      // Fetch from multiple sources first
      const multiSourceResources = await fetchFromMultipleSources();
      allResources.push(...multiSourceResources);
      
      // Then continue with category-based GitHub fetching if needed
      if (allResources.length < TARGET_RESOURCES) {
        for (const category of RESOURCE_CATEGORIES) {
          let page = 1;
          let hasMore = true;

          while (hasMore && allResources.length < TARGET_RESOURCES) {
            try {
              const resources = await fetchGithubRepos(category, page);
              
              // Filter out duplicates and add new resources
              const newResources = resources.filter(resource => !existingResources.has(resource.id));
              newResources.forEach(resource => {
                existingResources.add(resource.id);
                allResources.push(resource);
              });

              hasMore = resources.length === RESOURCES_PER_PAGE;
              page++;

              // Add delay between requests to avoid rate limiting
              await delay(2000);
            } catch (error: any) {
              if (error.response?.status === 403) {
                hasRateLimitError = true;
                console.log('Rate limit reached, waiting for reset...');
                await waitForRateLimitReset();
                continue;
              }
              throw error;
            }
          }
        }
      }
      break;
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed:`, error);
      if (retryCount === MAX_RETRIES) {
        console.log('Max retries reached, returning partial results');
        return allResources;
      }
    }
  }

  return allResources;
}

export async function fetchAllResources(): Promise<Resource[]> {
  // First, load stored resources
  const storedResources = loadStoredResources();
  
  if (storedResources.length >= TARGET_RESOURCES) {
    console.log(`Using ${storedResources.length} stored resources`);
    return storedResources;
  }

  try {
    // Start continuous fetching if not already started
    if (typeof window !== 'undefined' && !window.__fetchingStarted) {
      window.__fetchingStarted = true;
      startContinuousFetching().catch(console.error);
    }

    // Get fresh resources
    const freshResources = await fetchResourcesWithRetry();
    
    if (freshResources.length > 0) {
      // Append new resources to storage
      const combinedResources = appendResources(freshResources);
      console.log(`Total resources: ${combinedResources.length}`);
      return combinedResources;
    }

    // If we have stored resources, return those
    if (storedResources.length > 0) {
      return storedResources;
    }

    // Last resort: return fallback resources
    return fallbackResources;
  } catch (error) {
    console.error('Error in fetchAllResources:', error);
    
    // Return stored or fallback resources on error
    if (storedResources.length > 0) {
      return storedResources;
    }
    return fallbackResources;
  }
}

async function startContinuousFetching() {
  while (true) {
    try {
      if (getResourceCount() >= TARGET_RESOURCES) {
        console.log('Target resource count reached');
        break;
      }

      const freshResources = await fetchResourcesWithRetry();
      if (freshResources.length > 0) {
        appendResources(freshResources);
      }

      // Check rate limit status
      const resetTime = await checkRateLimit();
      if (resetTime > 0) {
        console.log(`Rate limit will reset in ${Math.ceil(resetTime / 1000)} seconds`);
        await delay(Math.min(resetTime, FETCH_INTERVAL));
      } else {
        await delay(FETCH_INTERVAL);
      }
    } catch (error) {
      console.error('Error in continuous fetching:', error);
      await delay(FETCH_INTERVAL);
    }
  }
}

startContinuousFetching();

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
  let rateLimitResetTime: number | null = null;

  if (!rateLimitResetTime) return;

  const currentTime = Date.now();
  const waitTime = rateLimitResetTime - currentTime;

  if (waitTime > 0) {
    console.log(`Rate limit hit. Waiting until ${new Date(rateLimitResetTime).toLocaleString()}`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
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

const RESOURCE_CATEGORIES = [
  'Frontend Development',
  'Backend Development', 
  'Mobile Development', 
  'DevOps & CI/CD', 
  'Cloud Native', 
  'Security & Compliance'
];

// Add this type declaration for the window object
declare global {
  interface Window {
    __fetchingStarted?: boolean;
  }
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
