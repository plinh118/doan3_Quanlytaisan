// app/api/files/upload/[...path]/route.js
import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';
import { mkdir } from 'fs/promises';

export async function POST(req, { params }) {
  try {
    const { path: pathSegments } = params;
    const uploadPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments || '';
    const uploadDir = path.join(process.cwd(), 'uploads', uploadPath);
    await mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
      multiples: true,
    });

    const [fields, files] = await form.parse(req);
    const uploadedFiles = Object.values(files).flat().map(file => ({
      originalName: file.originalFilename,
      path: file.filepath,
      size: file.size,
    }));

    const uploadedPaths = uploadedFiles.map(file => 
      `/uploads/${uploadPath}/${path.basename(file.path)}`
    );

    return new Response(
      JSON.stringify({
        status: 'success',
        uploadedPaths: uploadedPaths,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error.message || 'Failed to upload files',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { path: pathSegments } = params;
    const filePath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
    if (!filePath) throw new Error('Missing file path');

    const fullPath = path.join(process.cwd(), 'uploads', filePath);
    const stats = await fs.stat(fullPath);
    
    const fileInfo = {
      name: path.basename(fullPath),
      size: stats.size,
      lastModified: stats.mtime.toISOString(),
      path: `/uploads/${filePath}`,
    };

    return new Response(
      JSON.stringify(fileInfo),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Get file info error:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error.message || 'Failed to get file info',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}