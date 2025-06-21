import { Resource, fallbackResources } from './data';
import { BrowserCache } from '../utils/cache';

const RESOURCES_CACHE_KEY = 'resources_cache';
const RESOURCES_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

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

function truncateDescription(description: string): string {
  if (!description) return '';
  const DESCRIPTION_MAX_LENGTH = 200;
  if (description.length <= DESCRIPTION_MAX_LENGTH) return description;
  
  const lastSpace = description.lastIndexOf(' ', DESCRIPTION_MAX_LENGTH);
  return lastSpace > 0 ? description.slice(0, lastSpace) + '...' : description.slice(0, DESCRIPTION_MAX_LENGTH) + '...';
}

function determineCategory(name: string, description: string): string {
  const nameL = name.toLowerCase();
  const descL = (description || '').toLowerCase();
  
  if (nameL.includes('frontend') || descL.includes('frontend') || nameL.includes('react') || nameL.includes('vue')) return 'Frontend Development';
  if (nameL.includes('backend') || descL.includes('backend') || nameL.includes('server')) return 'Backend Development';
  if (nameL.includes('mobile') || descL.includes('mobile') || nameL.includes('android') || nameL.includes('ios')) return 'Mobile Development';
  if (nameL.includes('ai') || descL.includes('machine learning') || nameL.includes('ml')) return 'Data & AI';
  if (nameL.includes('security') || descL.includes('security')) return 'Security & Compliance';
  if (nameL.includes('docker') || nameL.includes('kubernetes') || descL.includes('container')) return 'Cloud Native';
  if (nameL.includes('ci') || nameL.includes('cd') || descL.includes('devops')) return 'DevOps & CI/CD';
  return 'Development Tools';
}

function determineResourceType(name: string, topics: string[]): Resource['type'] {
  const nameL = name.toLowerCase();
  const topicsL = topics.map(t => t.toLowerCase());

  if (topicsL.includes('framework') || nameL.includes('framework')) {
    return 'framework';
  }
  if (topicsL.includes('library') || nameL.includes('lib')) {
    return 'library';
  }
  return 'tool';
}

// Curated high-quality resources to supplement fallback data
const curatedResources: Resource[] = [
  {
    id: 'custom-coldfetch',
    title: CUSTOM_REPO.name,
    description: truncateDescription(CUSTOM_REPO.description),
    link: CUSTOM_REPO.html_url,
    url: CUSTOM_REPO.html_url,
    category: 'System Tools',
    type: 'tool',
    stars: CUSTOM_REPO.stargazers_count,
    dateAdded: new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    tags: CUSTOM_REPO.topics
  },
  {
    id: 'linux-kernel',
    title: 'Linux Kernel',
    description: 'The Linux kernel source tree',
    link: 'https://github.com/torvalds/linux',
    url: 'https://github.com/torvalds/linux',
    category: 'System Tools',
    type: 'tool',
    stars: 150000,
    dateAdded: new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    tags: ['kernel', 'linux', 'operating-system']
  },
  {
    id: 'neovim',
    title: 'Neovim',
    description: 'Vim-fork focused on extensibility and usability',
    link: 'https://github.com/neovim/neovim',
    url: 'https://github.com/neovim/neovim',
    category: 'Development Tools',
    type: 'tool',
    stars: 75000,
    dateAdded: new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    tags: ['editor', 'vim', 'neovim']
  },
  {
    id: 'tmux',
    title: 'tmux',
    description: 'Terminal multiplexer',
    link: 'https://github.com/tmux/tmux',
    url: 'https://github.com/tmux/tmux',
    category: 'Development Tools',
    type: 'tool',
    stars: 32000,
    dateAdded: new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    tags: ['terminal', 'multiplexer', 'cli']
  },
  {
    id: 'zsh',
    title: 'Zsh',
    description: 'The Z shell',
    link: 'https://github.com/zsh-users/zsh',
    url: 'https://github.com/zsh-users/zsh',
    category: 'Development Tools',
    type: 'tool',
    stars: 15000,
    dateAdded: new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    tags: ['shell', 'zsh', 'terminal']
  }
];

export async function fetchAllResources(): Promise<Resource[]> {
  try {
    const cache = new BrowserCache();
    const cachedResources = await cache.get<Resource[]>(RESOURCES_CACHE_KEY);
    
    if (cachedResources && cachedResources.length > 0) {
      console.log(`Using ${cachedResources.length} cached resources`);
      return cachedResources;
    }

    // Combine curated resources with fallback resources
    const allResources = [...curatedResources, ...fallbackResources];
    
    // Remove duplicates based on URL
    const uniqueResources = Array.from(
      new Map(allResources.map(resource => [resource.link, resource])).values()
    );

    // Cache the resources
    await cache.set(RESOURCES_CACHE_KEY, uniqueResources, RESOURCES_CACHE_DURATION);
    
    console.log(`Loaded ${uniqueResources.length} curated resources`);
    return uniqueResources;
    
  } catch (error) {
    console.error('Error in fetchAllResources:', error);
    
    // Return combined curated and fallback resources on error
    const allResources = [...curatedResources, ...fallbackResources];
    const uniqueResources = Array.from(
      new Map(allResources.map(resource => [resource.link, resource])).values()
    );
    
    return uniqueResources;
  }
}