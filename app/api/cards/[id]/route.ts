import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if card exists and belongs to user
    const card = await db.productCard.findUnique({
      where: { id },
    });

    if (!card || card.userId !== user.id) {
      return NextResponse.json(
        { error: 'Card not found or unauthorized' },
        { status: 404 },
      );
    }

    // Delete card
    await db.productCard.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, price, link, notes, imageUrl, stackId } = await req.json();

    // Get user ID from email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if card exists and belongs to user
    const card = await db.productCard.findUnique({
      where: { id },
    });

    if (!card || card.userId !== user.id) {
      return NextResponse.json(
        { error: 'Card not found or unauthorized' },
        { status: 404 },
      );
    }

    // Update card
    const updatedCard = await db.productCard.update({
      where: { id },
      data: {
        name,
        price,
        link,
        notes,
        imageUrl,
        stackId,
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 },
    );
  }
}
