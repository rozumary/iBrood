import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface FileSystemEntry {
 name: string;
  isDirectory: boolean;
  path: string;
}

// Simple in-memory cache for folder contents
const folderCache = new Map();

// Cache timeout in milliseconds (10 minutes)
const CACHE_TIMEOUT = 10 * 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folderName: string }> | { folderName: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const folderName = decodeURIComponent(resolvedParams.folderName);
    console.log('Requested folder name:', folderName);
    console.log('Raw params:', resolvedParams.folderName);
    
    const cacheKey = folderName;
    const cachedData = folderCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIMEOUT) {
      console.log('Returning cached data for folder:', folderName);
      return Response.json({ contents: cachedData.contents });
    }

    const folderPathParts = folderName.split('/');
    const folderPath = path.join(process.cwd(), 'public', 'MODELS', ...folderPathParts);
    console.log('Full folder path:', folderPath);
    console.log('CWD:', process.cwd());
    console.log('Path parts:', folderPathParts);

    const modelsDir = path.resolve(process.cwd(), 'public', 'MODELS');
    const resolvedFolderPath = path.resolve(folderPath);
    const relativePath = path.relative(modelsDir, resolvedFolderPath);

    const normalizedRelativePath = relativePath.replace(/\\/g, '/');
    if (normalizedRelativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      console.log('Security check failed');
      return Response.json(
        { error: 'Invalid folder path' },
        { status: 400 }
      );
    }

    try {
      await fs.access(folderPath);
    } catch {
      console.log('Folder does not exist:', folderPath);
      return Response.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    const items = await fs.readdir(folderPath);
    const contents = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(folderPath, item);
        const stat = await fs.stat(itemPath);
        return {
          name: item,
          isDirectory: stat.isDirectory(),
          path: itemPath
        };
      })
    );

    folderCache.set(cacheKey, {
      contents,
      timestamp: Date.now()
    });

    console.log('Successfully read folder contents, count:', contents.length);
    return Response.json({ contents });
  } catch (error) {
    console.error('Error reading folder contents:', error);
    return Response.json(
      { error: 'Unable to read folder contents: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
