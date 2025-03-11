'use server';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
export async function getStacks(apiKey: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stacks`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stacks');
    }

    const data = await response.json();
    return { data: data, message: 'Stacks fetched successfully', status: 200 };
  } catch (error) {
    console.error('Error fetching stacks:', error);
    throw error;
  }
}
export async function getUserStacks() {
  try {
    const session = await getServerSession(authOptions);
    // Get user's stacks
    const stacks = await db.stack.findMany({
      where: {
        user: {
          email: session?.user?.email,
        },
      },
      include: {
        _count: {
          select: { productCards: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return stacks;
  } catch (error) {
    console.error('Error fetching stacks:', error);
    throw error;
  }
}

export async function createStack(apiKey: string, data: any) {
  console.log(data);

  try {
    const response = await fetch(`${baseUrl}/api/v1/stacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stacks');
    }

    const result = await response.json();
    // console.log(result);

    if (result.status === 201) {
      revalidatePath('/stacks');
      return { data: data, message: 'Stack created successfully', status: 201 };
    } else {
      return {
        data: null,
        message: 'Stacks creation failed',
        status: 500,
      };
    }
  } catch (error) {
    console.error('Error fetching stacks:', error);
    throw error;
  }
}

export async function deleteStack(apiKey: string, id: any) {
  console.log(apiKey, id);

  try {
    const response = await fetch(`${baseUrl}/api/v1/stacks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });

    const result = await response.json();
    // console.log(result);

    if (result.status === 201) {
      revalidatePath('/stacks');
      return {
        data: result,
        message: 'Stack deleted successfully.',
        status: 201,
      };
    } else {
      return {
        data: null,
        message: 'Stacks deletion failed.',
        status: 500,
      };
    }
  } catch (error) {
    console.error('Error fetching stacks:', error);
    throw error;
  }
}

export async function getUserStackBySlug(slug: string) {
  try {
    const session = await getServerSession(authOptions);
    // Get user's stacks
    const stack = await db.stack.findFirst({
      where: {
        slug: slug,
        user: {
          email: session?.user?.email,
        },
      },
      include: {
        productCards: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: { productCards: true },
        },
      },
    });

    return stack;
  } catch (error) {
    console.error('Error fetching stacks:', error);
    throw error;
  }
}

export async function updateStack(apiKey: string, stackId: string, data: any) {
  // console.log('Data ✅:', data);

  try {
    const response = await fetch(`${baseUrl}/api/v1/stacks/${stackId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(data),
    });

    // if (!response.ok) {
    //   throw new Error('Failed to update stack');
    // }

    const result = await response.json();
    // console.log('Response ✅', response);

    if (result.status === 201) {
      revalidatePath('/stacks');
      return { data: data, message: 'Stack updated successfully', status: 201 };
    } else {
      return {
        data: null,
        message: 'Stacks updating failed',
        status: 500,
      };
    }
  } catch (error) {
    console.error('Error updating stack:', error);
    throw error;
  }
}
