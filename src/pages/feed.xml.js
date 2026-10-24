import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';


export async function GET(context) {
  const postImportResult = import.meta.glob('./writing/*.md', { eager: true });
  const posts = Object.values(postImportResult);
  // compiledContent() has returned a Promise since Astro 5.
  const items = await Promise.all(
    posts.map(async (post) => ({
      link: post.url,
      content: sanitizeHtml(await post.compiledContent()),
      ...post.frontmatter,
    })),
  );
  return rss({
    title: 'Thadeus Smith',
    description: 'Writing by Thadeus Smith',
    customData: `<language>en-us</language>`,
    //more configuration options here: https://github.com/withastro/astro/tree/main/packages/astro-rss
    site: context.site,
    items,
  });
}