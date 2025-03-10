import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      url,
      notes,
      imageUrl,
      showImage,
      price,
      aspectRatio,
      stackId,
    } = await req.json();

    // Get user ID from email
    const user = await db.user.findUnique({
      where: { email: session?.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate stack belongs to user
    if (stackId) {
      const stack = await db.stack.findUnique({
        where: { id: stackId },
      });

      if (!stack || stack.userId !== user.id) {
        if (!user.id) {
          return NextResponse.json(
            { error: 'Stack not found or unauthorized' },
            { status: 404 },
          );
        }
      }
    }

    // Create product card
    const card = await db.productCard.create({
      data: {
        name: title,
        price: price || 0,
        link: url,
        notes,
        imageUrl,
        aspectRatio,
        showImage,
        userId: user?.id,
        ...(stackId ? { stackId } : {}),
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const stackId = url.searchParams.get('stackId');

    // Get user ID from email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get cards
    const cards = await db.productCard.findMany({
      where: {
        userId: user.id,
        ...(stackId ? { stackId } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 },
    );
  }
}
