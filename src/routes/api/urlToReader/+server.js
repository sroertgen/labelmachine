import { error } from '@sveltejs/kit';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { parseHTML } from 'linkedom';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const loadUrl = String(url.searchParams.get('url') ?? '');
  const res = await fetch(loadUrl);
  const htmlText = await res.text();

  const { document } = parseHTML(htmlText);

  // Check if the content is suitable for Readability
  if (!isProbablyReaderable(document)) {
    throw new Error('The page is not reader-friendly.');
  }

  let reader = new Readability(document);
  let article = reader.parse();

  return new Response(JSON.stringify({ ...article, url: loadUrl }))
}
