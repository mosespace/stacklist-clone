import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CardCreatorBot/1.0)',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract all possible images
    const images: string[] = [];

    // OG image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) images.push(ogImage);

    // Twitter image
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage && !images.includes(twitterImage))
      images.push(twitterImage);

    // Article image
    const articleImage = $('meta[property="article:image"]').attr('content');
    if (articleImage && !images.includes(articleImage))
      images.push(articleImage);

    // Look for large images in the content
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      const dataSrc = $(element).attr('data-src');
      const imgSrc = dataSrc || src;

      if (
        imgSrc &&
        !imgSrc.includes('icon') &&
        !imgSrc.includes('logo') &&
        imgSrc.startsWith('http')
      ) {
        if (!images.includes(imgSrc)) {
          images.push(imgSrc);
        }
      }
    });

    // Extract detailed description
    let description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // If description is too short, try to get content from the first paragraph
    if (description.length < 100) {
      const firstParagraph = $('article p, .content p, .main p, main p')
        .first()
        .text()
        .trim();
      if (firstParagraph && firstParagraph.length > description.length) {
        description = firstParagraph;
      }
    }

    // Extract price if available (common for e-commerce sites)
    let price: string | null = null;

    // Look for price in meta tags
    const metaPrice =
      $('meta[property="product:price:amount"]').attr('content') ||
      $('meta[property="og:price:amount"]').attr('content');

    if (metaPrice) {
      price = metaPrice;
    } else {
      // Look for common price selectors
      const priceSelectors = [
        '.price',
        '.product-price',
        '.offer-price',
        '[data-price]',
        '[itemprop="price"]',
        '.current-price',
        '.sale-price',
      ];

      for (const selector of priceSelectors) {
        const priceElement = $(selector).first();
        if (priceElement.length) {
          const priceText = priceElement.text().trim();
          if (priceText && /\d/.test(priceText)) {
            price = priceText;
            break;
          }
        }
      }
    }

    // Extract metadata
    const metadata = {
      title:
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        '',
      description: description,
      images: images,
      url: url,
      price: price,
      siteName:
        $('meta[property="og:site_name"]').attr('content') ||
        new URL(url).hostname,
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Metadata extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 },
    );
  }
}
