import axios from 'axios';

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
}

interface HNResponse {
  hits: Array<{
    title: string;
    url: string;
    created_at: string;
    author: string;
    story_text: string | null;
    objectID: string;
  }>;
}

async function fetchHackerNews(query: string): Promise<NewsArticle[]> {
  try {
    const response = await axios.get<HNResponse>(`https://hn.algolia.com/api/v1/search?query=${query}`);
    return response.data.hits.map(item => ({
      id: item.objectID,
      title: item.title,
      description: item.story_text || 'Click to read more...',
      url: item.url,
      source: {
        id: 'hackernews',
        name: 'Hacker News'
      },
      publishedAt: item.created_at,
      author: item.author
    }));
  } catch (error) {
    console.error(`Error fetching from Hacker News with query ${query}:`, error);
    return [];
  }
}

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set();
  return articles.filter(article => {
    const duplicate = seen.has(article.title);
    seen.add(article.title);
    return !duplicate;
  });
}

function filterRelevantArticles(articles: NewsArticle[]): NewsArticle[] {
  const relevantTerms = [
    'linux',
    'open source',
    'opensource',
    'technology',
    'software',
    'development',
    'programming',
    'developer',
    'tech'
  ];

  return articles.filter(article => {
    const content = `${article.title} ${article.description}`.toLowerCase();
    return relevantTerms.some(term => content.includes(term.toLowerCase()));
  });
}

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    // Fetch from all queries in parallel
    const [linuxArticles, techArticles, technologyArticles] = await Promise.all([
      fetchHackerNews('linux'),
      fetchHackerNews('tech'),
      fetchHackerNews('technology')
    ]);

    // Combine all articles
    let allArticles = [...linuxArticles, ...techArticles, ...technologyArticles];

    // Remove duplicates
    allArticles = deduplicateArticles(allArticles);

    // Filter for relevance
    allArticles = filterRelevantArticles(allArticles);

    // Sort by date
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return allArticles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
