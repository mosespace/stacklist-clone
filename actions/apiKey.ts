import { db } from '@/lib/db';
import { generateApiKey } from '@/lib/generateApiKey';
import { getCurrentUser } from '@/lib/session';

('use server');
export async function createApiKey() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Generate a random API key
    const apiKey = generateApiKey();

    // Check if user already has an API key
    const existingUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (existingUser?.apiKey) {
      return { success: true, apiKey: existingUser.apiKey };
    }

    // Create new API key if none exists
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        apiKey: apiKey,
      },
    });

    return { success: true, apiKey };
  } catch (error) {
    console.error('Error generating API key:', error);
    return { success: false, error: 'Failed to generate API key' };
  }
}
