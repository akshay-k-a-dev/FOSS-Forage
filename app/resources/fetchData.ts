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
    // Only fetch top starred repos to stay within limits
    const toolsData = await fetchGithubRepos('stars:>5000');
    
    // Remove duplicates and format
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
        tags: resource.tags || []
      }))
      .slice(0, 50); // Limit to 50 top resources
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}
