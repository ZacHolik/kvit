import fs from 'fs';

const html = fs.readFileSync(new URL('./landing-source.html', import.meta.url), 'utf8');
let css = html.match(/<style>([\s\S]*?)<\/style>/)[1];

css = css.replace(/\*{margin:0;padding:0;box-sizing:border-box}/, '');
css = css.replace(':root{', '#kvit-landing{');
css = css.replace(
  /body\{font-family:'DM Sans',sans-serif;background:var\(--bg\);color:var\(--text\);overflow-x:hidden;line-height:1\.6\}/,
  '',
);

const extraRoot =
  'font-family:var(--font-dm-sans),DM Sans,sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;line-height:1.6;min-height:100vh;';
css = css.replace(/#kvit-landing\{/, `#kvit-landing{${extraRoot}`);

css = css.replace(
  /^h1,h2,h3,h4,h5\{/m,
  '#kvit-landing h1,#kvit-landing h2,#kvit-landing h3,#kvit-landing h4,#kvit-landing h5{',
);

const lines = css.split('\n');
let inMedia = false;
let mediaBrace = 0;
const out = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('@keyframes')) {
    out.push(line);
    continue;
  }
  if (trimmed.startsWith('@media')) {
    inMedia = true;
    mediaBrace =
      (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    out.push(line);
    continue;
  }
  if (inMedia) {
    mediaBrace +=
      (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    const m = line.match(/^(\s*)([^{]+)(\{.*)$/);
    if (m && !m[2].trim().startsWith('#kvit-landing')) {
      const sel = m[2].trim();
      if (sel && !sel.startsWith('/*')) {
        out.push(line.replace(/^(\s*)([^{]+)(\{.*)$/, `$1#kvit-landing $2$3`));
      } else {
        out.push(line);
      }
    } else {
      out.push(line);
    }
    if (mediaBrace <= 0) {
      inMedia = false;
    }
    continue;
  }
  if (!trimmed || trimmed.startsWith('/*')) {
    out.push(line);
    continue;
  }
  const m = line.match(/^(\s*)([^{]+)(\{.*)$/);
  if (m && m[3]) {
    const sel = m[2].trim();
    if (sel.startsWith('#kvit-landing') || sel.startsWith('@')) {
      out.push(line);
    } else if (sel.startsWith('html{')) {
      out.push(line);
    } else {
      out.push(line.replace(/^(\s*)([^{]+)(\{.*)$/, `$1#kvit-landing $2$3`));
    }
  } else {
    out.push(line);
  }
}

let result = [
  '#kvit-landing,#kvit-landing *{box-sizing:border-box}',
  '#kvit-landing *{margin:0;padding:0}',
  ...out,
].join('\n');

result = result.replace(
  /font-family:'Syne',sans-serif/g,
  'font-family:var(--font-syne),Syne,sans-serif',
);
result = result.replace(
  /font-family:'DM Sans',sans-serif/g,
  'font-family:var(--font-dm-sans),DM Sans,sans-serif',
);

result = result.replace(/#kvit-landing html\{/g, 'html{');

result += `\n#kvit-landing .nav-actions{display:flex;align-items:center;gap:0.75rem;flex-shrink:0}
#kvit-landing .nav-login{color:var(--text2);text-decoration:none;font-size:0.9rem;font-weight:500;transition:color 0.2s;white-space:nowrap}
#kvit-landing .nav-login:hover{color:var(--text)}
#kvit-landing .section--tight-top{padding-top:0}
#kvit-landing .section-sub--accent{color:var(--teal2);font-weight:500}`;

const ts = `/* eslint-disable max-len -- generated from index.html landing CSS */
export const KVIT_LANDING_CSS = ${JSON.stringify(result)};
`;

fs.writeFileSync(
  new URL('../src/app/kvit-landing-css.ts', import.meta.url),
  ts,
);

console.log('Wrote src/app/kvit-landing-css.ts', ts.length, 'chars');
