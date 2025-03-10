import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Stack ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const stack = await db.stack.findUnique({
      where: {
        id: id,
      },
      include: {
        productCards: {
          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    if (!stack || (stack.userId !== userId && !stack.isPublic)) {
      return new NextResponse(
        JSON.stringify({ error: 'Not found or unauthorized' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return NextResponse.json(stack);
  } catch (error) {
    console.error('STACK_GET_ERROR', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Stack ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const stack = await db.stack.findUnique({
      where: {
        id: id,
      },
    });

    if (!stack || stack.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Not found or unauthorized' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const body = await req.json();
    const { name, description, isPublic } = body;

    const updatedStack = await db.stack.update({
      where: {
        id: id,
      },
      data: {
        name: name ?? stack.name,
        description: description ?? stack.description,
        isPublic: isPublic ?? stack.isPublic,
      },
    });

    return NextResponse.json(updatedStack);
  } catch (error) {
    console.error('STACK_UPDATE_ERROR', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Stack ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const stack = await db.stack.findUnique({
      where: {
        id: id,
      },
    });

    if (!stack || stack.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Not found or unauthorized' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    await db.stack.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('STACK_DELETE_ERROR', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
