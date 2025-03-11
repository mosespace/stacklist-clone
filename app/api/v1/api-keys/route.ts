import { NextResponse } from 'next/server';

import { verifyApiKey } from '@/actions/verify-api-key';
import { db } from '@/lib/db';
import { generateApiKey } from '@/lib/generateApiKey';

export async function POST(req: Request) {
  try {
    const verificationResult = await verifyApiKey();

    if (!verificationResult.success) {
      return Response.json(
        { error: verificationResult.message },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { name } = body;

    const generatedKey = generateApiKey();

    const existingKey = await db.apiKey.findUnique({
      where: {
        key: generatedKey,
        userId: verificationResult.userId,
      },
    });

    if (existingKey) {
      return NextResponse.json(
        { message: 'API Key already exists' },
        { status: 400 },
      );
    }

    const apiKey = await db.apiKey.create({
      data: {
        key: generateApiKey(),
        name,
        userId: verificationResult.userId as string,
      },
    });

    return NextResponse.json({
      message: 'Successfully created api key',
      status: 201,
      data: apiKey,
    });
  } catch (error) {
    console.error('API_KEYS_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function GET() {
  try {
    const verificationResult = await verifyApiKey();

    if (!verificationResult.success) {
      return Response.json(
        { error: verificationResult.message },
        { status: 401 },
      );
    }

    const apiKeys = await db.apiKey.findMany({
      where: {
        userId: verificationResult.userId as string,
      },
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('API_KEYS_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
