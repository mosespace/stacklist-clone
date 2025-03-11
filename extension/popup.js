// Updated Google Sign-In and authentication handling

document.addEventListener('DOMContentLoaded', function () {
  const authForm = document.getElementById('auth-form');
  const authScreen = document.getElementById('auth-screen');
  const captureForm = document.getElementById('capture-form');
  const errorMessage = document.getElementById('error-message');
  const googleSignInBtn = document.getElementById('google-signin');
  const signOutBtn = document.getElementById('sign-out');
  const successScreen = document.getElementById('success-screen');
  const captureAnotherBtn = document.getElementById('capture-another');

  // Check if already authenticated
  checkAuthStatus().then((isAuthenticated) => {
    if (isAuthenticated) {
      authScreen.classList.add('hidden');
      captureForm.classList.remove('hidden');

      // Also populate the product fields if we're on a product page
      captureProductInfo();
    }
  });

  // Handle credentials sign-in form submission
  authForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorMessage.textContent = '';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      errorMessage.textContent = 'Please enter both email and password';
      return;
    }

    console.log('Attempting to sign in with credentials...');
    const result = await signInWithCredentials(email, password);

    if (result.success) {
      console.log('Authentication successful, showing capture form');
      authScreen.classList.add('hidden');
      captureForm.classList.remove('hidden');
      captureProductInfo();
    } else {
      console.log('Authentication failed:', result.error);
      errorMessage.textContent =
        result.error === 'Invalid credentials'
          ? 'Invalid email or password. Please try again.'
          : 'Authentication failed: ' + (result.error || 'Unknown error');
    }
  });

  // Handle Google sign-in button click
  googleSignInBtn.addEventListener('click', function () {
    initiateGoogleSignIn();
  });

  // Handle sign out
  signOutBtn.addEventListener('click', async function () {
    await signOut();
    captureForm.classList.add('hidden');
    authScreen.classList.remove('hidden');
  });

  // Handle "Capture Another" button
  if (captureAnotherBtn) {
    captureAnotherBtn.addEventListener('click', function () {
      successScreen.classList.add('hidden');
      captureForm.classList.remove('hidden');
      captureProductInfo();
    });
  }

  // Handle product form submission
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const productData = {
        url: document.getElementById('product-url').value,
        title: document.getElementById('product-title').value,
        price: document.getElementById('product-price').value,
        notes: document.getElementById('product-notes').value,
        imageUrl: document.getElementById('product-image').value,
      };

      try {
        await sendToAPI(productData);
        captureForm.classList.add('hidden');
        successScreen.classList.remove('hidden');
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save card. Please try again.');
      }
    });
  }
});

// Capture product info from the current tab
function captureProductInfo() {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const currentTab = tabs[0];
      const url = currentTab.url;

      // Set the URL field
      document.getElementById('product-url').value = url;

      // Show loading state
      const loadingIndicator = document.createElement('div');
      loadingIndicator.id = 'loading-indicator';
      loadingIndicator.textContent = 'Fetching product details...';
      document.getElementById('capture-form').appendChild(loadingIndicator);

      try {
        // Call your metadata API
        const response = await fetch(
          'https://stacklist-clone.vercel.app/api/v1/metadata',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
            credentials: 'include', // Important for passing cookies
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }

        const metadata = await response.json();

        // Update form fields with metadata
        if (metadata.title) {
          document.getElementById('product-title').value = metadata.title;
        }

        // Extract price if available
        if (metadata.price) {
          const priceMatch = metadata.price.match(/[\d,.]+/);
          if (priceMatch) {
            const priceValue = priceMatch[0].replace(/,/g, '');
            document.getElementById('product-price').value = priceValue;
          } else {
            document.getElementById('product-price').value = metadata.price;
          }
        }

        // Set image URL if available
        if (metadata.images && metadata.images.length > 0) {
          document.getElementById('product-image').value = metadata.images[0];

          // If you want to display the image preview
          const imagePreview = document.getElementById('image-preview');
          if (imagePreview) {
            imagePreview.src = metadata.images[0];
            imagePreview.classList.remove('hidden');
          }

          // If you want to add image selection functionality
          if (metadata.images.length > 1) {
            displayImageSelectionUI(metadata.images);
          }
        }

        // Add description/notes
        if (metadata.description) {
          document.getElementById('product-notes').value = metadata.description;
        }
      } catch (error) {
        // console.error('Error fetching metadata:', error);
        // Fall back to the current content script extraction method
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTab.id },
            function: extractProductInfo,
          },
          (results) => {
            if (results && results[0] && results[0].result) {
              const info = results[0].result;
              if (info.title)
                document.getElementById('product-title').value = info.title;
              if (info.description)
                document.getElementById('product-notes').value =
                  info.description;
              if (info.price)
                document.getElementById('product-price').value = info.price;
              if (info.imageUrl)
                document.getElementById('product-image').value = info.imageUrl;
            }
          },
        );
      } finally {
        // Remove loading indicator
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
          indicator.remove();
        }
      }
    },
  );
}

// Update extractProductInfo function to also get description
function extractProductInfo() {
  const productInfo = {
    title: '',
    price: '',
    imageUrl: '',
    description: '',
  };

  // Try to find product title
  const titleSelectors = [
    'h1',
    '.product-title',
    '.product-name',
    '[data-testid="product-title"]',
    '[itemprop="name"]',
  ];

  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      productInfo.title = element.textContent.trim();
      break;
    }
  }

  // Try to find product price
  const priceSelectors = [
    '.price',
    '.product-price',
    '[data-testid="price"]',
    '[itemprop="price"]',
    '.offer-price',
  ];

  for (const selector of priceSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      productInfo.price = element.textContent.trim();
      break;
    }
  }

  // Try to find product image
  const imgSelectors = [
    '.product-image img',
    '[data-testid="product-image"]',
    '[itemprop="image"]',
    '.main-image img',
    'img.product',
  ];

  for (const selector of imgSelectors) {
    const element = document.querySelector(selector);
    if (element && element.src) {
      productInfo.imageUrl = element.src;
      break;
    }
  }

  // Try to find product description
  const descriptionSelectors = [
    '[itemprop="description"]',
    '.product-description',
    '.description',
    '#description',
    'meta[name="description"]',
    'meta[property="og:description"]',
  ];

  for (const selector of descriptionSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      if (element.tagName === 'META') {
        productInfo.description = element.getAttribute('content') || '';
      } else {
        productInfo.description = element.textContent.trim();
      }
      if (productInfo.description) break;
    }
  }

  return productInfo;
}

// Update sendToAPI function to include notes in the data
async function sendToAPI(data) {
  const baseUrl = 'https://stacklist-clone.vercel.app';
  const apiUrl = `${baseUrl}/api/v1/cards`;

  try {
    // First check if the user is still authenticated
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    // Get the showImage preference from a checkbox or default value
    const showImage =
      document.getElementById('show-image-checkbox')?.checked ?? true;

    // Add showImage, notes, and aspectRatio to the data
    const enhancedData = {
      ...data,
      // notes: document.getElementById('product-notes').value,
      showImage,
      aspectRatio: '16:9', // Default or get from a selector
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enhancedData),
      credentials: 'include', // Important for passing cookies with the request
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error sending data to API:', error);
    throw error;
  }
}

// Sign in with email/password credentials
async function signInWithCredentials(email, password) {
  try {
    // Set loading state
    const loginButton = document.querySelector('.submit-btn');
    if (loginButton) {
      loginButton.textContent = 'Signing in...';
      loginButton.disabled = true;
    }

    // Step 1: Get the CSRF token from the signin page
    const baseUrl = 'https://stacklist-clone.vercel.app';
    const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
    const { csrfToken } = await csrfResponse.json();

    if (!csrfToken) {
      console.error('Failed to get CSRF token');
      return { success: false, error: 'Failed to get CSRF token' };
    }

    // Step 2: Submit credentials to the correct NextAuth endpoint
    const authResponse = await fetch(
      `${baseUrl}/api/auth/callback/credentials`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          redirect: 'false',
          // callbackUrl: `${baseUrl}/dashboard`,
          json: 'true',
        }),
        credentials: 'include',
      },
    );

    // Check HTTP status to better handle authentication errors
    if (authResponse.status === 401) {
      console.error('Authentication failed: Invalid credentials');
      return { success: false, error: 'Invalid credentials' };
    }

    // Parse the authentication response
    let authResult;
    try {
      authResult = await authResponse.json();
    } catch (e) {
      console.error('Failed to parse auth response:', e);
      const text = await authResponse.text();
      console.log('Response text:', text);
      return { success: false, error: 'Failed to parse response' };
    }

    console.log('Auth response:', authResult);

    // Check for error in the response
    if (authResult.error) {
      console.error('Authentication error:', authResult.error);
      return { success: false, error: authResult.error };
    }

    // If we get a url back, authentication was successful
    if (authResult.url) {
      // Store auth state in chrome.storage
      chrome.storage.local.set({
        isAuthenticated: true,
        userEmail: email,
        lastLogin: new Date().toISOString(),
      });

      return { success: true };
    } else {
      console.error('Authentication failed: Unknown error');
      return { success: false, error: 'Unknown error' };
    }
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message || 'Unknown error' };
  } finally {
    // Always reset button state
    const loginButton = document.querySelector('.submit-btn');
    if (loginButton) {
      loginButton.textContent = 'Sign In';
      loginButton.disabled = false;
    }
  }
}

// Initiate Google Sign-In process
function initiateGoogleSignIn() {
  const baseUrl = 'https://stacklist-clone.vercel.app';

  // Create and open a new window to handle authentication
  chrome.windows.create(
    {
      url: `${baseUrl}/api/auth/signin/google?callbackUrl=${encodeURIComponent(`${baseUrl}/chrome-extension-callback`)}`,
      type: 'popup',
      width: 600,
      height: 700,
    },
    function (window) {
      // Store the window id to track it
      chrome.storage.local.set({ authWindowId: window.id });

      // Set a timer to check for authentication success
      const checkInterval = setInterval(() => {
        checkAuthStatus().then((isAuthenticated) => {
          if (isAuthenticated) {
            // Close the auth window if still open
            chrome.windows.remove(window.id, () => {
              const error = chrome.runtime.lastError;
              if (error) console.log('Window already closed');
            });

            clearInterval(checkInterval);

            // Update UI
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('capture-form').classList.remove('hidden');
            captureProductInfo();
          }
        });
      }, 1000); // Check every second

      // Stop checking after 2 minutes (in case user never completes auth)
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 120000);
    },
  );
}

// Check if user is authenticated
async function checkAuthStatus() {
  const baseUrl = 'https://stacklist-clone.vercel.app';

  try {
    const response = await fetch(`${baseUrl}/api/auth/session`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    const session = await response.json();

    // If session exists and has user data, user is authenticated
    if (session && session.user) {
      // Update local storage with session info
      chrome.storage.local.set({
        isAuthenticated: true,
        userEmail: session.user.email,
        userName: session.user.name,
        userId: session.user.id,
        lastLogin: new Date().toISOString(),
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
}

// Sign out function
async function signOut() {
  const baseUrl = 'https://stacklist-clone.vercel.app';

  try {
    // Call NextAuth signout endpoint
    await fetch(`${baseUrl}/api/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        callbackUrl: baseUrl,
        json: 'true',
      }),
      credentials: 'include',
    });

    // Clear extension storage
    chrome.storage.local.remove([
      'isAuthenticated',
      'userEmail',
      'userName',
      'userId',
      'lastLogin',
    ]);

    console.log('Successfully signed out');
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
