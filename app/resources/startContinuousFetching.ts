import { getResourceCount, appendResources } from "../utils/persistentStorage";
import { Resource } from "../resources/data";

const TARGET_RESOURCES = 100;
const setInterval = 1000; // Placeholder value for interval in milliseconds

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchResources(): Promise<Resource[]> {
    // Placeholder implementation
    return [];
}

async function checkRateLimit(): Promise<number> {
    // Placeholder implementation
    return 0;
}

async function fetchResourcesWithRetry(retries = 3): Promise<Resource[]> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const resources: Resource[] = await fetchResources();
            return resources;
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt < retries - 1) {
                await delay(1000); // Wait 1 second before retrying
            }
        }
    }
    console.error('All retry attempts failed.');
    return [];
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
        await delay(Math.min(resetTime, setInterval));
      } else {
        await delay(setInterval);
      }
    } catch (error) {
      console.error('Error in continuous fetching:', error);
      await delay(setInterval);
    }
  }
}
