import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateApiKey } from '@/lib/generateApiKey';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const apiKey = await db.apiKey.create({
      data: {
        key: generateApiKey(),
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    console.error('API_KEYS_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const apiKeys = await db.apiKey.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('API_KEYS_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
