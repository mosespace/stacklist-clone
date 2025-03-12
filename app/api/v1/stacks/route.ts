import { db } from '@/lib/db';
import { generateSlug } from '@/lib/generate-slug';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // const verificationResult = await verifyApiKey();

    // if (!verificationResult.success) {
    //   return Response.json(
    //     { error: verificationResult.message },
    //     { status: 401 },
    //   );
    // }
    const publicStacks = await db.stack.findMany({
      where: {
        isPublic: true,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
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

    return NextResponse.json(publicStacks);
  } catch (error) {
    console.error('PUBLIC_STACKS_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { name, description, isPublic } = body;

    const formattedSlug = generateSlug(name);

    if (!name) {
      return new NextResponse(JSON.stringify({ message: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingStack = await db.stack.findFirst({
      where: {
        slug: formattedSlug,
      },
    });

    if (existingStack) {
      return new NextResponse(
        JSON.stringify({ message: 'Stack with this slug already exists' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // console.log(name, slug, description, isPublic, userId);

    const stack = await db.stack.create({
      data: {
        name,
        slug: formattedSlug,
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
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
