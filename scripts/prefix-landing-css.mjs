import fs from 'fs';

const html = fs.readFileSync(new URL('./landing-source.html', import.meta.url), 'utf8');
let css = html.match(/<style>([\s\S]*?)<\/style>/)[1];

css = css.replace(/\*{margin:0;padding:0;box-sizing:border-box}/, '');
css = css.replace(':root{', '#kvik-landing{');
css = css.replace(
  /body\{font-family:'DM Sans',sans-serif;background:var\(--bg\);color:var\(--text\);overflow-x:hidden;line-height:1\.6\}/,
  '',
);

const extraRoot =
  'font-family:var(--font-dm-sans),DM Sans,sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;line-height:1.6;min-height:100vh;';
css = css.replace(/#kvik-landing\{/, `#kvik-landing{${extraRoot}`);

css = css.replace(
  /^h1,h2,h3,h4,h5\{/m,
  '#kvik-landing h1,#kvik-landing h2,#kvik-landing h3,#kvik-landing h4,#kvik-landing h5{',
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
    if (m && !m[2].trim().startsWith('#kvik-landing')) {
      const sel = m[2].trim();
      if (sel && !sel.startsWith('/*')) {
        out.push(line.replace(/^(\s*)([^{]+)(\{.*)$/, `$1#kvik-landing $2$3`));
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
    if (sel.startsWith('#kvik-landing') || sel.startsWith('@')) {
      out.push(line);
    } else if (sel.startsWith('html{')) {
      out.push(line);
    } else {
      out.push(line.replace(/^(\s*)([^{]+)(\{.*)$/, `$1#kvik-landing $2$3`));
    }
  } else {
    out.push(line);
  }
}

let result = [
  '#kvik-landing,#kvik-landing *{box-sizing:border-box}',
  '#kvik-landing *{margin:0;padding:0}',
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

result = result.replace(/#kvik-landing html\{/g, 'html{');

result += `\n#kvik-landing .nav-actions{display:flex;align-items:center;gap:1rem;flex-shrink:0}
#kvik-landing .nav-login-text{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0.5rem 1rem;border:1px solid #94a3a0;border-radius:8px;background:transparent;color:#94a3a0;font-size:0.9rem;font-weight:500;line-height:1.2;text-decoration:none;white-space:nowrap;transition:color 0.2s,border-color 0.2s,background 0.2s}
#kvik-landing .nav-login-text:hover{color:#e2e8e7;border-color:#c5d0ce;background:rgba(148,163,160,0.08)}
#kvik-landing .section--tight-top{padding-top:0}
#kvik-landing .section-sub--accent{color:var(--teal2);font-weight:500}`;

const ts = `/* eslint-disable max-len -- generated from index.html landing CSS */
export const KVIK_LANDING_CSS = ${JSON.stringify(result)};
`;

fs.writeFileSync(
  new URL('../src/app/kvik-landing-css.ts', import.meta.url),
  ts,
);

console.log('Wrote src/app/kvik-landing-css.ts', ts.length, 'chars');
