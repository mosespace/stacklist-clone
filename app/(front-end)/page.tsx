import {
  ArrowRight,
  Box,
  Check,
  FolderPlus,
  Layers,
  List,
  PenBox,
  PieChart,
  Search,
  Share2,
  Star,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import Image from 'next/image';

export default async function HomePage() {
  const user = await getCurrentUser();

  const steps = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: 'Find Products',
      description:
        "Browse e-commerce sites or use our Chrome extension to find products you're interested in.",
    },
    {
      icon: <FolderPlus className="h-10 w-10 text-primary" />,
      title: 'Create Stacks',
      description:
        'Organize products into stacks based on categories, needs, or any criteria you choose.',
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: 'Compare & Share',
      description:
        'Compare products side by side and share your stacks with others to help them decide.',
    },
  ];

  const testimonials = [
    {
      quote:
        'ProductStack has completely changed how I shop online. I can now compare products across different sites and make informed decisions.',
      author: 'Sarah Johnson',
      role: 'Tech Enthusiast',
      avatar: '/avatar.jpg',
    },
    {
      quote:
        'The ability to create and share stacks has been invaluable for our family planning major purchases. We saved over $300 on our new appliances!',
      author: 'Michael Chen',
      role: 'Smart Shopper',
      avatar: '/avatar.jpg',
    },
    {
      quote:
        'As a product reviewer, the API access lets me integrate my stacks directly into my blog. My readers love the interactive comparisons.',
      author: 'Alex Rivera',
      role: 'Content Creator',
      avatar: '/avatar.jpg',
    },
  ];
  return (
    <div className="flex w-full flex-col">
      {/* Hero section */}
      <section className="space-y-6 h-screen mx-auto max-w-5xl pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Make smarter shopping decisions <br className="hidden sm:inline" />
            with easy product comparisons
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Compare products across different e-commerce platforms, create
            stacks to organize your comparisons, and share them with friends and
            family.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            {user ? (
              <Button size="lg" asChild>
                <Link href="/overview">
                  My Stacks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link href="/discover">Discover Public Stacks</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-muted py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-4xl">
              Features that make comparison shopping easier
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our platform provides all the tools you need to make informed
              purchasing decisions.
            </p>
          </div>
          <div className="mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-12 max-w-5xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Layers className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Create Stacks</h3>
              <p className="text-muted-foreground">
                Organize products into stacks for easy comparison. Create as
                many stacks as you need for different product categories.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <List className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Compare Products</h3>
              <p className="text-muted-foreground">
                Add product cards with details like price, description, and
                links. Compare prices and specifications side by side.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Box className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Chrome Extension</h3>
              <p className="text-muted-foreground">
                Add products to your stacks directly from e-commerce websites
                with our Chrome extension.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <PieChart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">API Access</h3>
              <p className="text-muted-foreground">
                Generate API keys to access your stacks and product cards
                programmatically for integration with other tools.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Check className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Make Better Decisions</h3>
              <p className="text-muted-foreground">
                With all the information in one place, make confident purchasing
                decisions based on price, features, and more.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <PenBox className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Create Stacks</h3>
              <p className="text-muted-foreground">
                Organize products into stacks for easy comparison. Create as
                many stacks as you need for different product categories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Three simple steps to start comparing products and making better
                decisions.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center space-y-4"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-center text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-10 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-16 rounded-lg border bg-muted/20 p-8 shadow-sm">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-2xl font-bold">Chrome Extension</h3>
                <p className="text-muted-foreground">
                  Our Chrome extension makes it even easier to add products to
                  your stacks directly from e-commerce websites. Just click the
                  extension icon, select a stack, and the product details will
                  be automatically captured.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                    <span>Works on all major e-commerce sites</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                    <span>Automatically extracts product details</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                    <span>Add to existing or new stacks</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[300px] overflow-hidden rounded-lg">
                <Image
                  src="/chrome-extension.png"
                  alt="Chrome Extension Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-20">
        <div className="container max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Users Say
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Join thousands of smart shoppers who use ProductStack to make
                better purchasing decisions.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-center text-muted-foreground">
                  "{testimonial.quote}"
                </p>
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar || '/avatar.jpg'}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12  mx-auto max-w-5xl md:py-20 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-4xl">
              Ready to start comparing?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Sign up today and start organizing your product comparisons.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row mt-6">
              {user ? (
                <Button size="lg" asChild>
                  <Link href="/stacks">
                    Go to My Stacks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
