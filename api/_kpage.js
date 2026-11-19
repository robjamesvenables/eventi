// The members app page (/k/CODE) with the venue's own name and logo in the link preview
// (WhatsApp, iMessage...). Same k.html for everyone - only the <head> tags differ.
// Demo keyrings use the prospect's details; real keyrings look up their company (its name and logo),
// and a demo company dressed as a prospect (Design your page) shows that prospect.
const fs = require('fs'), path = require('path');
const P = require('./_prospects');
const L = require('./_lib');
let HTML = null;
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SITE = 'https://app.getmavis.co';
const imgOf = v => SITE + (v.icon ? v.icon + '-512.png' : v.logo);
async function realOf(code){
  const kk = (await L.db('member_keyrings?select=company_id&code=eq.' + encodeURIComponent(code)).catch(() => []))[0];
  if (!kk) return null;
  const [cos, gps] = await Promise.all([
    L.db('companies?select=name,logo&id=eq.' + encodeURIComponent(kk.company_id)).catch(() => []),
    L.db('guest_page?select=content&company_id=eq.' + encodeURIComponent(kk.company_id)).catch(() => [])]);
  const gc = gps[0] && gps[0].content, as = gc && typeof gc.as === 'string' ? gc.as : '';
  const pro = as ? P.byKey(as) : null;
  if (pro) return { brand: pro.brand, img: imgOf(pro) };   // demo company dressed as a prospect
  const co = cos[0] || {};
  if (!co.name) return null;
  const lg = String(co.logo || '');
  return { brand: co.name, img: /^https:\/\/[^\s"'<>]+$/.test(lg) ? lg : SITE + '/api/gp?a=icon&c=' + code };
}
module.exports = async (req, res) => {
  try {
    if (!HTML) HTML = fs.readFileSync(path.join(process.cwd(), 'k.html'), 'utf8');
    const code = String((req.query && req.query.c) || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
    let v = null;
    const pro = P.get(code);
    if (pro) v = { brand: pro.brand, img: imgOf(pro) };
    else if (code.length >= 4) { try { v = await realOf(code); } catch (e) { v = null; } }
    let out = HTML;
    if (v) {
      const title = v.brand + ' Members Club';
      const tags = '<title>' + esc(title) + '</title>' +
        '<meta property="og:title" content="' + esc(title) + '">' +
        '<meta property="og:description" content="' + esc('Your members app - perks, events and booking') + '">' +
        '<meta property="og:image" content="' + esc(v.img) + '"><meta property="og:image:width" content="512"><meta property="og:image:height" content="512">' +
        '<meta property="og:type" content="website"><meta property="og:url" content="' + esc(SITE + '/k/' + code) + '">' +
        '<meta name="twitter:card" content="summary"><meta name="twitter:image" content="' + esc(v.img) + '">';
      out = out.replace('<title>Members Club</title>', tags).replace('<link rel="icon" type="image/png" href="/favicon-v6.png">', '<link rel="icon" type="image/png" href="' + esc(v.img) + '">');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    res.statusCode = 200; res.end(out);
  } catch (e) { res.statusCode = 302; res.setHeader('Location', '/k.html'); res.end(); }
};
