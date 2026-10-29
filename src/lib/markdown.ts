// Turn rendered Markdown into the markup the hand-written pages used, so
// that moving the text into Markdown files leaves the design unchanged.
// These run at build time only.

// Inner HTML of a list item, without the <p> wrappers Markdown adds when
// list items are separated by blank lines.
function unwrap(html: string): string {
  return html.replace(/<\/?p>/g, '').trim();
}

/**
 * A résumé description: each paragraph, then each bullet as "• text",
 * separated by line breaks. This is the inline form the résumé's
 * `.description` span has always used.
 */
export function descriptionHtml(html: string): string {
  const lines: string[] = [];
  for (const m of html.matchAll(/<li>([\s\S]*?)<\/li>|<p>([\s\S]*?)<\/p>/g)) {
    lines.push(m[1] !== undefined ? '• ' + unwrap(m[1]) : m[2].trim());
  }
  return lines.join('\n<br>\n');
}

// Index of the first " by " that is not inside a link, italics or other
// element (so a title like *Stand by Me* is left alone), or -1.
function bylineIndex(html: string): number {
  let depth = 0;
  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end === -1) break;
      const tag = html.slice(i, end + 1);
      if (tag.startsWith('</')) depth--;
      else if (!tag.endsWith('/>') && !/^<(br|img|hr|wbr)\b/i.test(tag)) depth++;
      i = end;
    } else if (depth === 0 && html.startsWith(' by ', i)) {
      return i;
    }
  }
  return -1;
}

/**
 * The Links page. Each list item is two lines: the title (and " by
 * author"), then the description on the next line. The title becomes the
 * bold `.name`, the description the small grey `.about`.
 */
export function linksHtml(html: string): string {
  return html
    // The page title is the <h2>, so the Markdown's ## sections become <h3>,
    // ### subsections <h4> and #### <h5>. The ids Astro added are kept, so
    // the jump links still land on them.
    .replace(/<(\/?)h([2-5])\b/g, (_, slash: string, n: string) => `<${slash}h${Number(n) + 1}`)
    .replace(/<ul>/g, '<ul class="links">')
    .replace(/<li>([\s\S]*?)<\/li>/g, (_, inner: string) => {
      const text = unwrap(inner);
      const nl = text.indexOf('\n');
      const head = nl === -1 ? text : text.slice(0, nl).trim();
      const about = nl === -1 ? '' : text.slice(nl + 1).trim();
      const by = bylineIndex(head);
      const name = by === -1 ? head : head.slice(0, by);
      const rest = by === -1 ? '' : head.slice(by);
      return `<li><span class="name">${name}</span>${rest}` +
        (about ? `<span class="about">${about}</span>` : '') + '</li>';
    });
}
