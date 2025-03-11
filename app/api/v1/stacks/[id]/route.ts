import { verifyApiKey } from '@/actions/verify-api-key';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const verificationResult = await verifyApiKey();

    if (!verificationResult.success) {
      return Response.json(
        { error: verificationResult.message },
        { status: 401 },
      );
    }

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

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    if (!id) {
      return new NextResponse('Stack ID is required', { status: 400 });
    }

    const stack = await db.stack.delete({
      where: {
        id: id,
      },
    });

    if (!stack) {
      return new NextResponse('Stack not found', { status: 404 });
    }

    return NextResponse.json({
      data: stack,
      status: 201,
      message: 'Stack Created Successfully',
    });
  } catch (error) {
    console.error('PUBLIC_STACK_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Update a stack
export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const verificationResult = await verifyApiKey();

    if (!verificationResult.success) {
      return Response.json(
        { error: verificationResult.message },
        { status: 401 },
      );
    }
    const { name, description, isPublic } = await req.json();

    // Check if stack exists and belongs to user
    const existingStack = await db.stack.findUnique({
      where: { id },
    });

    if (!existingStack || existingStack.userId !== verificationResult.userId) {
      return NextResponse.json(
        { error: 'Stack not found or unauthorized' },
        { status: 404 },
      );
    }

    // Update stack
    const updatedStack = await db.stack.update({
      where: { id },
      data: {
        ...(name && { name }),
        description,
        ...(typeof isPublic === 'boolean' && { isPublic }),
      },
      include: {
        _count: {
          select: { productCards: true },
        },
      },
    });

    return NextResponse.json(updatedStack);
  } catch (error) {
    console.error('Error updating stack:', error);
    return NextResponse.json(
      { error: 'Failed to update stack' },
      { status: 500 },
    );
  }
}
