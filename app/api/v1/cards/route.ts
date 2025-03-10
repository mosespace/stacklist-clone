import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { name, price, link, notes, imageUrl, stackId } = body;

    if (!name || !price || !link || !stackId) {
      return new NextResponse(
        JSON.stringify({
          error: 'Name, price, link, and stackId are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Verify the stack belongs to the user
    const stack = await db.stack.findUnique({
      where: {
        id: stackId,
      },
    });

    if (!stack || stack.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Stack not found or not owned by the user' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const productCard = await db.productCard.create({
      data: {
        name,
        price: parseFloat(price.toString()),
        link,
        notes,
        imageUrl,
        userId,
        stackId,
      },
    });

    return NextResponse.json(productCard);
  } catch (error) {
    console.error('CREATE_CARD_ERROR', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
