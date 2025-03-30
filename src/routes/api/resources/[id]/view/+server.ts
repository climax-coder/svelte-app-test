import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ params }: RequestEvent) {
  try {
    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    });
    return json(resource);
  } catch (error) {
    console.error('Error updating view count:', error);
    return json({ error: 'Failed to update view count' }, { status: 500 });
  }
} 