'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ApiKeyUsage() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

    toast({
      title: 'Copied!',
      description: 'Code snippet copied to clipboard',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Using Your API Keys</h3>
        <p className="text-muted-foreground">
          API keys allow you to access your data programmatically. Use them to
          build integrations, automate workflows, or create custom applications.
        </p>
      </div>

      <Tabs defaultValue="javascript" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="curl">cURL</TabsTrigger>
        </TabsList>

        <TabsContent value="javascript" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Fetch Products</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(jsProductsExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Get all products from your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{jsProductsExample}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Create Product</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(jsCreateExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Add a new product to a stack</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{jsCreateExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Fetch Products</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(pythonProductsExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Get all products from your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{pythonProductsExample}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Create Product</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(pythonCreateExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Add a new product to a stack</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{pythonCreateExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curl" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Fetch Products</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(curlProductsExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Get all products from your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{curlProductsExample}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Create Product</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(curlCreateExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Add a new product to a stack</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{curlCreateExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 bg-muted p-4 rounded-md">
        <h4 className="font-medium mb-2">Authentication</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Include your API key in the request headers for authentication:
        </p>
        <pre className="bg-background p-3 rounded-md text-sm">
          <code>{`Authorization: ApiKey YOUR_API_KEY`}</code>
        </pre>
      </div>
    </div>
  );
}

const jsProductsExample = `// Fetch all products
const fetchProducts = async () => {
  const response = await fetch('https://your-domain.com/api/cards', {
    method: 'GET',
    headers: {
      'Authorization': 'ApiKey YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
};`;

const jsCreateExample = `// Create a new product
const createProduct = async (productData) => {
  const response = await fetch('https://your-domain.com/api/cards', {
    method: 'POST',
    headers: {
      'Authorization': 'ApiKey YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Product Name',
      price: 99.99,
      link: 'https://example.com/product',
      description: 'Product description',
      imageUrl: 'https://example.com/image.jpg',
      stackId: 'your-stack-id'
    })
  });
  
  const data = await response.json();
  return data;
};`;

const pythonProductsExample = `import requests

# Fetch all products
def fetch_products():
    url = "https://your-domain.com/api/cards"
    headers = {
        "Authorization": "ApiKey YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()`;

const pythonCreateExample = `import requests

# Create a new product
def create_product():
    url = "https://your-domain.com/api/cards"
    headers = {
        "Authorization": "ApiKey YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    data = {
        "name": "Product Name",
        "price": 99.99,
        "link": "https://example.com/product",
        "description": "Product description",
        "imageUrl": "https://example.com/image.jpg",
        "stackId": "your-stack-id"
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()`;

const curlProductsExample = `# Fetch all products
curl -X GET \\
  https://your-domain.com/api/cards \\
  -H 'Authorization: ApiKey YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`;

const curlCreateExample = `# Create a new product
curl -X POST \\
  https://your-domain.com/api/cards \\
  -H 'Authorization: ApiKey YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Product Name",
    "price": 99.99,
    "link": "https://example.com/product",
    "description": "Product description",
    "imageUrl": "https://example.com/image.jpg",
    "stackId": "your-stack-id"
  }'`;
