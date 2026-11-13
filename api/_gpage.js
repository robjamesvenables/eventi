// Guest guide page (/g/<slug>) with the hotel's own icon, name and link preview instead of Mavis.
// Same g.html for every hotel - only the <head> tags differ.
const fs = require('fs'), path = require('path');
const G = require('./_guides');
let HTML = null;
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
module.exports = (req, res) => {
  try {
    if (!HTML) HTML = fs.readFileSync(path.join(process.cwd(), 'g.html'), 'utf8');
    const slug = String((req.query && req.query.g) || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30);
    const g = G.get(slug);
    let out = HTML;
    if (g) {
      const site = 'https://app.getmavis.co', ic = g.icon ? g.icon + '-192.png' : g.logo, img = site + (g.icon ? g.icon + '-512.png' : g.logo), title = g.brand + ' · Guest Guide';
      const tags = '<title>' + esc(title) + '</title>' +
        '<meta property="og:title" content="' + esc(title) + '">' +
        '<meta property="og:description" content="' + esc("What's on, opening hours, offers and events") + '">' +
        '<meta property="og:image" content="' + esc(img) + '"><meta property="og:image:width" content="512"><meta property="og:image:height" content="512">' +
        '<meta property="og:type" content="website"><meta property="og:url" content="' + esc(site + '/g/' + slug) + '">' +
        '<meta name="twitter:card" content="summary"><meta name="twitter:image" content="' + esc(img) + '">' +
        '<link rel="apple-touch-icon" href="' + esc(img) + '">';
      out = out.replace('<title>Guest Guide</title>', tags)
        .replace('<link rel="icon" type="image/png" href="/favicon-v6.png">', '<link rel="icon" type="image/png" href="' + esc(ic) + '">')
        .replace('<meta name="theme-color" content="#7A1F1F">', '<meta name="theme-color" content="' + esc((g.theme && g.theme.top) || '#7A1F1F') + '">');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    res.statusCode = 200; res.end(out);
  } catch (e) { res.statusCode = 302; res.setHeader('Location', '/g.html?g=' + encodeURIComponent(String((req.query && req.query.g) || '').replace(/[^a-z0-9-]/gi, ''))); res.end(); }   // fallback keeps the guide working
};
