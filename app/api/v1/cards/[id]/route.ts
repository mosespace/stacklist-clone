import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
        JSON.stringify({ error: 'Card ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const productCard = await db.productCard.findUnique({
      where: {
        id: id,
      },
      include: {
        stack: true,
      },
    });

    if (
      !productCard ||
      productCard.userId !== userId
      // (productCard.userId !== userId && !productCard.stack.isPublic)
    ) {
      return new NextResponse(
        JSON.stringify({ error: 'Not found or unauthorized' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return NextResponse.json(productCard);
  } catch (error) {
    console.error('CARD_GET_ERROR', error);
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
        JSON.stringify({ error: 'Card ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const productCard = await db.productCard.findUnique({
      where: {
        id: id,
      },
    });

    if (!productCard || productCard.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Not found or unauthorized' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const body = await req.json();
    const { name, price, link, notes, imageUrl, stackId } = body;

    // If stack ID is changing, verify ownership of the new stack
    if (stackId && stackId !== productCard.stackId) {
      const stack = await db.stack.findUnique({
        where: {
          id: stackId,
        },
      });

      if (!stack || stack.userId !== userId) {
        return new NextResponse(
          JSON.stringify({
            error: 'New stack not found or not owned by the user',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    }

    const updatedProductCard = await db.productCard.update({
      where: {
        id: id,
      },
      data: {
        name: name ?? productCard.name,
        price: price ? parseFloat(price.toString()) : productCard.price,
        link: link ?? productCard.link,
        notes: notes ?? productCard.notes,
        imageUrl: imageUrl ?? productCard.imageUrl,
        stackId: stackId ?? productCard.stackId,
      },
    });

    return NextResponse.json(updatedProductCard);
  } catch (error) {
    console.error('CARD_UPDATE_ERROR', error);
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
        JSON.stringify({ error: 'Card ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const productCard = await db.productCard.findUnique({
      where: {
        id: id,
      },
    });

    if (!productCard || productCard.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Not found or unauthorized' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    await db.productCard.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CARD_DELETE_ERROR', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
