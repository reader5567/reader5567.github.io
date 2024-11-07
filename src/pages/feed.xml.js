import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';


export function GET(context) {
  const postImportResult = import.meta.glob('./writing/*.md', { eager: true });
  const posts = Object.values(postImportResult);
  return rss({
    title: 'Thadeus Smith',
    description: 'Writing by Thadeus Smith',
    customData: `<language>en-us</language>`,
    //more configuration options here: https://github.com/withastro/astro/tree/main/packages/astro-rss
    site: context.site,
    items: posts.map((post) => ({
      link: post.url,
      content: sanitizeHtml(post.compiledContent()),
      ...post.frontmatter,
    })),
  });
}