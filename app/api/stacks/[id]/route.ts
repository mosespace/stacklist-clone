import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    if (!id) {
      return new NextResponse('Stack ID is required', { status: 400 });
    }

    const stack = await db.stack.findUnique({
      where: {
        id: id,
        isPublic: true, // Only return if it's public
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        productCards: {
          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    if (!stack) {
      return new NextResponse('Stack not found or not public', { status: 404 });
    }

    return NextResponse.json(stack);
  } catch (error) {
    console.error('PUBLIC_STACK_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
