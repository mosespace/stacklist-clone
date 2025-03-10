document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const authScreen = document.getElementById('auth-screen');
  const authForm = document.getElementById('auth-form');
  const captureForm = document.getElementById('capture-form');
  const productForm = document.getElementById('product-form');
  const successScreen = document.getElementById('success-screen');
  const captureAnotherBtn = document.getElementById('capture-another');
  const signOutBtn = document.getElementById('sign-out');

  // Check if user is already signed in
  checkAuthStatus();

  // Get current tab URL to pre-fill the URL field
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    document.getElementById('product-url').value = activeTab.url;

    // Try to auto-extract product details from the page
    try {
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: extractProductDetails,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const details = results[0].result;
            document.getElementById('product-title').value =
              details.title || '';
            document.getElementById('product-price').value =
              details.price || '';
            document.getElementById('product-image').value =
              details.imageUrl || '';
          }
        },
      );
    } catch (err) {
      console.log('Could not auto-extract product details:', err);
    }
  });

  // Handle authentication form submission
  authForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const success = await signIn(email, password);

      if (success) {
        // Hide auth screen and show capture form
        authScreen.classList.add('hidden');
        captureForm.classList.remove('hidden');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Error signing in. Please try again.');
    }
  });

  // Handle product form submission
  productForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const productData = {
      url: document.getElementById('product-url').value,
      title: document.getElementById('product-title').value,
      price: document.getElementById('product-price').value,
      imageUrl: document.getElementById('product-image').value,
    };

    try {
      // Send data to API
      await sendToAPI(productData);

      // Show success screen
      captureForm.classList.add('hidden');
      successScreen.classList.remove('hidden');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  });

  // Handle "Capture Another" button
  captureAnotherBtn.addEventListener('click', function () {
    successScreen.classList.add('hidden');
    captureForm.classList.remove('hidden');

    // Clear form fields except URL
    document.getElementById('product-title').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
  });

  // Handle sign out
  signOutBtn.addEventListener('click', function () {
    signOut();
    captureForm.classList.add('hidden');
    authScreen.classList.remove('hidden');
  });

  // Function to check authentication status
  function checkAuthStatus() {
    // Check if authentication token exists in storage
    chrome.storage.local.get(['authToken'], function (result) {
      if (result.authToken) {
        // User is signed in, show capture form
        authScreen.classList.add('hidden');
        captureForm.classList.remove('hidden');
      } else {
        // User is not signed in, show auth screen
        authScreen.classList.remove('hidden');
        captureForm.classList.add('hidden');
      }
    });
  }

  // Function to sign in
  async function signIn(email, password) {
    // Replace with your actual auth endpoint
    const authUrl = 'http://localhost:3000/auth/login';

    try {
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Store auth token in chrome.storage
      chrome.storage.local.set({ authToken: data.token });

      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  }

  // Function to sign out
  function signOut() {
    // Clear auth token from storage
    chrome.storage.local.remove(['authToken']);
  }

  // Function to send data to API
  async function sendToAPI(data) {
    // Replace with your actual API endpoint
    const apiUrl = 'https://your-api-endpoint.com/products';

    // Get auth token from storage
    const result = await chrome.storage.local.get(['authToken']);

    if (!result.authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${result.authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  // Function to extract product details from the current page
  function extractProductDetails() {
    // This function runs in the context of the web page
    try {
      // Basic extraction logic - customize based on your needs
      let title = '';
      let price = '';
      let imageUrl = '';

      // Try to find product title
      const possibleTitleElements = document.querySelectorAll(
        'h1, .product-title, .product-name',
      );
      if (possibleTitleElements.length > 0) {
        title = possibleTitleElements[0].textContent.trim();
      }

      // Try to find product price
      const possiblePriceElements = document.querySelectorAll(
        '.price, .product-price, span[itemprop="price"]',
      );
      if (possiblePriceElements.length > 0) {
        price = possiblePriceElements[0].textContent.trim();
      }

      // Try to find product image
      const possibleImageElements = document.querySelectorAll(
        '.product-image img, .main-image img',
      );
      if (possibleImageElements.length > 0 && possibleImageElements[0].src) {
        imageUrl = possibleImageElements[0].src;
      }

      return { title, price, imageUrl };
    } catch (error) {
      console.error('Error extracting product details:', error);
      return {};
    }
  }
});
