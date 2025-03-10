'use server';

export async function getStacks() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/stacks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

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
