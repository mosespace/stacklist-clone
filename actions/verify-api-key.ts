'use server';

import { getCurrentUser } from '@/lib/session';
import { headers } from 'next/headers';

export async function verifyApiKey() {
  try {
    // Get the current user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: 'Authentication failed - no current user found',
      };
    }

    // Get the API key from the request headers
    const headersList = await headers();
    const providedApiKey = headersList.get('x-api-key');

    if (!providedApiKey) {
      return {
        success: false,
        message: 'No API key provided in x-api-key header',
      };
    }

    // Get the user's API keys
    const apiKeys = currentUser.apiKeys || [];

    // Check if the provided API key is in the user's list of authorized keys
    const matchingKey = apiKeys.find((key) => key.key === providedApiKey);

    if (!matchingKey) {
      return {
        success: false,
        message: 'Invalid API key',
      };
    }

    // // Optional: Check if the key is expired
    // if (matchingKey.expiresAt && new Date(matchingKey.expiresAt) < new Date()) {
    //   return {
    //     success: false,
    //     message: "API key expired"
    //   };
    // }

    // API key is valid
    return {
      success: true,
      userId: currentUser.id,
      keyId: matchingKey.id,
      keyName: matchingKey.name,
    };
  } catch (error) {
    console.error('API key verification error:', error);
    return {
      success: false,
      message: 'Error verifying API key',
    };
  }
}
