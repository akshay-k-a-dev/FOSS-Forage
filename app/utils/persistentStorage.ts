import fs from 'fs';
import path from 'path';
import { Resource } from '../resources/data';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'resources.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(STORAGE_FILE))) {
    fs.mkdirSync(path.dirname(STORAGE_FILE), { recursive: true });
}

export function loadStoredResources(): Resource[] {
    try {
        if (fs.existsSync(STORAGE_FILE)) {
            const data = fs.readFileSync(STORAGE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading stored resources:', error);
    }
    return [];
}

export function saveResources(resources: Resource[]): void {
    try {
        // Ensure we have unique resources by ID
        const uniqueResources = Array.from(
            new Map(resources.map(resource => [resource.id, resource])).values()
        );
        
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(uniqueResources, null, 2));
        console.log(`Saved ${uniqueResources.length} resources to storage`);
    } catch (error) {
        console.error('Error saving resources:', error);
    }
}

export function appendResources(newResources: Resource[]): Resource[] {
    const existingResources = loadStoredResources();
    const existingIds = new Set(existingResources.map(r => r.id));
    
    // Only append resources that don't already exist
    const uniqueNewResources = newResources.filter(r => !existingIds.has(r.id));
    
    if (uniqueNewResources.length > 0) {
        const combinedResources = [...existingResources, ...uniqueNewResources];
        saveResources(combinedResources);
        console.log(`Appended ${uniqueNewResources.length} new resources`);
        return combinedResources;
    }
    
    return existingResources;
}

export function getResourceCount(): number {
    const resources = loadStoredResources();
    return resources.length;
}
