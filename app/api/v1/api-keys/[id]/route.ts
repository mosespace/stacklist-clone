import { verifyApiKey } from '@/actions/verify-api-key';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
type Params = Promise<{ id: string }>;

export async function DELETE(request: Request, { params }: { params: Params }) {
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
      return new NextResponse('API Key ID is required', { status: 400 });
    }

    const apiKey = await db.apiKey.findUnique({
      where: {
        id: id,
      },
    });

    if (!apiKey || apiKey.userId !== verificationResult?.userId) {
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
