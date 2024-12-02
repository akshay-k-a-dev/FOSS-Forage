import axios from 'axios';
import { Resource } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchGithubRepos(query: string): Promise<Partial<Resource>[]> {
  try {
    await delay(2000); // Wait 2 seconds between requests
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const { items = [] } = response.data;
    return items.map((repo: any) => ({
      id: `gh_${repo.id}`,
      title: repo.name,
      description: repo.description || '',
      link: repo.html_url,
      category: getCategoryFromRepo(repo),
      type: getTypeFromRepo(repo),
      tags: [...(repo.topics || []), repo.language].filter(Boolean)
    }));
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.error('Rate limit exceeded, waiting...');
      await delay(10000); // Wait 10 seconds if rate limited
      return [];
    }
    console.error('GitHub API error:', error.message);
    return [];
  }
}

function getCategoryFromRepo(repo: any): string {
  const languageMap: { [key: string]: string } = {
    'JavaScript': 'Frontend Development',
    'TypeScript': 'Frontend Development',
    'Java': 'Backend Development',
    'Kotlin': 'Backend Development',
    'Swift': 'Mobile Development',
    'Dart': 'Mobile Development',
    'Go': 'Backend Development',
    'Python': 'Backend Development',
    'Rust': 'Systems Development'
  };

  if (repo.topics?.includes('frontend')) return 'Frontend Development';
  if (repo.topics?.includes('backend')) return 'Backend Development';
  if (repo.topics?.includes('mobile')) return 'Mobile Development';
  if (repo.topics?.includes('devops')) return 'DevOps & CI/CD';
  if (repo.topics?.includes('security')) return 'Security & Compliance';
  if (repo.topics?.includes('ai')) return 'Data & AI';
  
  return languageMap[repo.language] || 'Development Tools';
}

function getTypeFromRepo(repo: any): string {
  if (repo.topics?.includes('framework')) return 'framework';
  if (repo.topics?.includes('library')) return 'library';
  if (repo.topics?.includes('tool')) return 'tool';
  if (repo.topics?.includes('platform')) return 'platform';
  return 'tool';
}

export async function fetchAllResources(): Promise<Resource[]> {
  try {
    // Comprehensive list of queries covering various open source categories
    const queries = [
      // Operating Systems
      'topic:linux stars:>100',
      'topic:unix stars:>100',
      'topic:bsd stars:>100',
      
      // Development Tools
      'topic:ide stars:>100',
      'topic:text-editor stars:>100',
      'topic:terminal stars:>100',
      'topic:shell stars:>100',
      
      // Programming Languages
      'topic:programming-language stars:>100',
      'topic:compiler stars:>100',
      'topic:interpreter stars:>100',
      
      // Web Development
      'topic:web-framework stars:>100',
      'topic:javascript-framework stars:>100',
      'topic:css-framework stars:>100',
      
      // Backend & Infrastructure
      'topic:database stars:>100',
      'topic:server stars:>100',
      'topic:container stars:>100',
      'topic:kubernetes stars:>100',
      
      // Security
      'topic:security-tools stars:>100',
      'topic:encryption stars:>100',
      'topic:authentication stars:>100',
      
      // AI & Data Science
      'topic:machine-learning stars:>100',
      'topic:data-science stars:>100',
      'topic:deep-learning stars:>100',
      
      // Mobile Development
      'topic:android stars:>100',
      'topic:ios stars:>100',
      'topic:cross-platform stars:>100',
      
      // Game Development
      'topic:game-engine stars:>100',
      'topic:game-development stars:>100',
      
      // Desktop Applications
      'topic:desktop-app stars:>100',
      'topic:gui stars:>100',
      'topic:desktop-environment stars:>100',
      
      // System Tools
      'topic:system-tools stars:>100',
      'topic:monitoring stars:>100',
      'topic:package-manager stars:>100',
      
      // Documentation & Learning
      'topic:documentation stars:>100',
      'topic:tutorial stars:>100',
      'topic:learning-resources stars:>100'
    ];

    // Fetch all queries in parallel with a small delay between each
    const allResults = await Promise.all(
      queries.map(async (query, index) => {
        await delay(index * 500); // Reduced delay to 500ms between requests
        return fetchGithubRepos(query);
      })
    );

    // Combine all results
    const toolsData = allResults.flat();
    
    // Remove duplicates but keep all valid resources
    const seen = new Set<string>();
    return toolsData
      .filter(resource => {
        if (!resource.title) return false;
        const key = resource.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((resource, index) => ({
        id: resource.id || index.toString(),
        title: resource.title!,
        description: resource.description || '',
        link: resource.link || '',
        category: resource.category || 'Development Tools',
        type: resource.type || 'tool',
        tags: [...(resource.tags || []), 'open-source'].filter((tag, i, arr) => arr.indexOf(tag) === i)
      }))
      .sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0)); // Sort by relevance but don't limit the number
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}
