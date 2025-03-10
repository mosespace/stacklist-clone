import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
type Params = Promise<{ id: string }>;

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!id) {
      return new NextResponse('API Key ID is required', { status: 400 });
    }

    const apiKey = await db.apiKey.findUnique({
      where: {
        id: id,
      },
    });

    if (!apiKey || apiKey.userId !== session.user.id) {
      return new NextResponse('Not found or unauthorized', { status: 404 });
    }

    await db.apiKey.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API_KEY_DELETE_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
