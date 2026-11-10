// Guest page for the demo keyrings, with the venue's own name and logo in the link preview
// (WhatsApp, iMessage...). Same k.html as everyone else - only the <head> tags differ.
// Only the demo codes are routed here (see vercel.json), so real guests are untouched.
const fs = require('fs'), path = require('path');
const P = require('./_prospects');
let HTML = null;
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
module.exports = (req, res) => {
  try {
    if (!HTML) HTML = fs.readFileSync(path.join(process.cwd(), 'k.html'), 'utf8');
    const code = String((req.query && req.query.c) || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
    const v = P.get(code);
    let out = HTML;
    if (v) {
      const site = 'https://app.getmavis.co', img = site + (v.icon ? v.icon + '-512.png' : v.logo), title = v.brand + ' Members Club';
      const tags = '<title>' + esc(title) + '</title>' +
        '<meta property="og:title" content="' + esc(title) + '">' +
        '<meta property="og:description" content="' + esc('Your members app - perks, events and booking') + '">' +
        '<meta property="og:image" content="' + esc(img) + '"><meta property="og:image:width" content="512"><meta property="og:image:height" content="512">' +
        '<meta property="og:type" content="website"><meta property="og:url" content="' + esc(site + '/k/' + code) + '">' +
        '<meta name="twitter:card" content="summary"><meta name="twitter:image" content="' + esc(img) + '">';
      out = out.replace('<title>Members Club</title>', tags).replace('<link rel="icon" type="image/png" href="/favicon-v6.png">', '<link rel="icon" type="image/png" href="' + esc(img) + '">');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    res.statusCode = 200; res.end(out);
  } catch (e) { res.statusCode = 302; res.setHeader('Location', '/k.html'); res.end(); }
};
