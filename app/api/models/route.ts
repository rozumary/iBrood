import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const modelsDir = path.join(process.cwd(), 'public', 'MODELS');
    let folders: string[] = [];
    
    // Check if directory exists using async operation
    try {
      await fs.access(modelsDir);
      const items = await fs.readdir(modelsDir);
      
      // Filter directories using Promise.all for better performance
      const isDirectoryPromises = items.map(async (name) => {
        const fullPath = path.join(modelsDir, name);
        const stat = await fs.stat(fullPath);
        return { name, isDirectory: stat.isDirectory() };
      });
      
      const results = await Promise.all(isDirectoryPromises);
      folders = results.filter(item => item.isDirectory).map(item => item.name);
    } catch (err) {
      // Directory doesn't exist, return empty array
      console.log('Models directory does not exist:', modelsDir);
    }
    
    return Response.json({ folders });
  } catch (error) {
    console.error('Error reading model folders:', error);
    return Response.json({ folders: [], error: 'Unable to read model folders' }, { status: 500 });
  }
}
