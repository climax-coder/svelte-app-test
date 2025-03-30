import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import { join } from 'path';
import { UPLOAD_DIR } from '$env/static/private';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return json(resources);
  } catch (error) {
    return json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const language = formData.get('language') as string;
    const provider = formData.get('provider') as string;
    const role = formData.get('role') as string;
    const file = formData.get('file') as File;
    
    if (!file) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check for duplicate title
    const existingResourceByTitle = await prisma.resource.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } }
    });

    if (existingResourceByTitle) {
      return json({ 
        error: 'Duplicate', 
        message: 'A resource with this title already exists.' 
      }, { status: 409 });
    }

    // Check for duplicate file
    const existingResourceByFileName = await prisma.resource.findFirst({
      where: { fileName: { equals: file.name, mode: 'insensitive' } }
    });

    if (existingResourceByFileName) {
      return json({ 
        error: 'Duplicate', 
        message: 'A file with this name already exists.' 
      }, { status: 409 });
    }

    const fileName = file.name;
    const fileType = file.type;
    const filePath = join(UPLOAD_DIR, fileName);

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Create resource in database
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category,
        language,
        provider,
        role,
        fileName,
        fileType,
        filePath,
        uploadedBy: 'Current User', // Replace with actual user info when auth is implemented
      }
    });

    return json(resource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    return json({ error: 'Failed to upload resource' }, { status: 500 });
  }
} 