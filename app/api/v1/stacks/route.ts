import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stacks = await db.stack.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            productCards: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(stacks);
  } catch (error) {
    console.error('STACKS_ERROR', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    console.log('UserID ✅', userId);

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { name, slug, description, isPublic } = body;

    if (!name) {
      return new NextResponse(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stack = await db.stack.create({
      data: {
        name,
        slug,
        description,
        isPublic: isPublic ?? false,
        userId,
      },
    });

    return NextResponse.json({
      data: stack,
      status: 201,
      message: 'Stack Created Successfully',
    });
  } catch (error) {
    console.error('CREATE_STACK_ERROR', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
