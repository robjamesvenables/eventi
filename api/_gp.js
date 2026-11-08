// Guest page marketing content (photo slides, daily deals, coming-up events, gallery) - shared by
// member-card (what the guest sees), gp-img (the photos) and gp-hit (the numbers).
// Content lives in the guest_page table, one row per company: { order, off, slides, deals, events, gallery }.

const SECTIONS = ['tonight', 'deals', 'events', 'gallery', 'venues'];
const httpsOk = u => /^https:\/\/[^\s"'<>]+$/i.test(String(u || '').trim());
const str = (v, n) => String(v == null ? '' : v).slice(0, n);
// An Instagram name from whatever was typed: "@senja", "senja" or an instagram.com link -> "senja"
const igName = v => { const m = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)?@?([a-z0-9._]{1,30})\/?(?:\?.*)?$/i.exec(String(v || '').trim()); return m ? m[1] : ''; };

// Every stored photo path in the content (so gp-img only ever serves photos that are really on the page)
function paths(c){
  const out = [];
  ['slides', 'deals', 'events', 'gallery'].forEach(k => (Array.isArray(c && c[k]) ? c[k] : []).forEach(it => { if (it && it.path) out.push(String(it.path)); }));
  Object.values((c && c.places) || {}).forEach(p => { if (p && p.path) out.push(String(p.path)); (Array.isArray(p && p.menus) ? p.menus : []).forEach(m => { if (m && m.path) out.push(String(m.path)); (Array.isArray(m && m.pages) ? m.pages : []).forEach(pg => { if (pg && pg.path) out.push(String(pg.path)); }); }); });
  return out;
}

// Demo company venues: four made-up places around Bali (older demo data used Rooftop / Harbour / Garden / Beach Club)
const DEMO_VENUES = [
  { name: 'Senja Rooftop', area: 'Uluwatu', opens: '16:00', closes: '01:00' },
  { name: 'Ombak Beach Club', area: 'Sanur', opens: '10:00', closes: '00:00' },
  { name: 'Saffron & Salt', area: 'Seminyak', opens: '17:00', closes: '23:00' },
  { name: 'Kopi Pagi', area: 'Canggu', opens: '07:00', closes: '17:00' }
].map(v => Object.assign(v, { map: 'https://maps.google.com', wa: '6281234567890', phone: '+62 812 3456 7890', email: v.name.toLowerCase().replace(/[^a-z]+/g, '') + '@example.com', review: 'https://www.google.com/maps' }));
const DEMO_RENAME = { 'rooftop': 'Senja Rooftop', 'beach club': 'Ombak Beach Club', 'harbour': 'Saffron & Salt', 'garden': 'Kopi Pagi' };
const isOldDemo = list => Array.isArray(list) && list.some(v => v && DEMO_RENAME[String(v.name || '').toLowerCase().trim()]);
// Demo only: swap any old venue name for its new made-up place (keeps the saved hours, map and WhatsApp)
const renameDemo = list => (list || []).map(v => { const n = DEMO_RENAME[String((v && v.name) || '').toLowerCase().trim()]; if (!n) return v; const d = DEMO_VENUES.find(x => x.name === n); return Object.assign({}, v, { name: n, area: v.area || d.area, email: v.email || d.email, review: v.review || d.review }); });

// Demo company: a page that always looks alive
function demo(today){
  const y = +today.slice(0, 4);
  const nye = (today > y + '-12-31' ? y + 1 : y) + '-12-31', xmas = (today > y + '-12-25' ? y + 1 : y) + '-12-25';
  const plus = n => { const d = new Date(today + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  return {
    order: SECTIONS.slice(), off: {},
    slides: [
      { id: 'ds1', img: '/demo-guest/martini.jpg', title: '2 for 1 cocktails', line: 'Every day 5–7pm', venue: 'Senja Rooftop' },
      { id: 'ds3', img: '/demo-guest/ombak.jpg', title: 'Pool days', line: 'Daybeds from 10am', venue: 'Ombak Beach Club' },
      { id: 'ds4', img: '/demo-guest/fish.jpg', title: 'New dinner menu', line: 'From 5pm', venue: 'Saffron & Salt' },
      { id: 'ds5', img: '/demo-guest/pasta.jpg', title: 'Breakfast all day', line: 'Coffee from 7am', venue: 'Kopi Pagi' }
    ],
    deals: [
      { id: 'dd1', img: '/demo-guest/martini.jpg', title: '2 for 1 cocktails', when: 'Daily · 5–7pm', venue: 'Senja Rooftop' },
      { id: 'dd2', img: '/demo-guest/pasta.jpg', title: 'Breakfast + coffee · Rp 95k', when: 'Daily · 7–11am', venue: 'Kopi Pagi' },
      { id: 'dd3', img: '/demo-guest/fish.jpg', title: 'Early dinner · 20% off', when: 'Mon–Thu · 5–7pm', venue: 'Saffron & Salt' },
      { id: 'dd4', img: '/demo-guest/ombak.jpg', title: 'Daybed + bucket of beers · Rp 600k', when: 'Weekdays · 10am–4pm', venue: 'Ombak Beach Club' }
    ],
    events: [
      { id: 'de1', img: '/demo-guest/party.jpg', title: "New Year's Eve", line: 'Fireworks, DJs, free-flow from Rp 1.5m', date: nye, time: '20:00', time2: '03:00', venue: 'Senja Rooftop', btn: 'tickets', url: 'https://megatix.co.id', hl: true,
        details: 'DJ Ayu and DJ Kai, a live sax player and fireworks over the ocean at midnight.', age: '21', dress: 'Smart - all white', price: 'From Rp 1.5m, free-flow included', notes: 'Tables for 6+ by WhatsApp. Sells out every year.', more: [{ ic: 'car', label: 'Parking', text: 'Free valet at the front' }] },
      { id: 'de2', img: '/demo-guest/fish.jpg', title: 'Christmas Lunch', line: 'Four courses by the water', date: xmas, time: '12:00', time2: '16:00', venue: 'Saffron & Salt', btn: 'wa',
        details: 'Four courses, carols, and Santa for the little ones.', age: 'all', dress: 'Smart casual', price: 'Rp 850k, kids half price' },
      { id: 'de3', img: '/demo-guest/chef.jpg', title: "Chef's Table", line: 'Seven courses, 12 seats only', date: plus(9), time: '19:00', time2: '22:30', venue: 'Saffron & Salt', btn: 'wa',
        details: 'Seven courses cooked in front of you, with a wine pairing.', dress: 'Smart casual', price: 'Rp 1.2m per person', notes: 'Tell us about any allergies when you book.' },
      { id: 'de4', img: '/demo-guest/party.jpg', title: 'Full Moon Rooftop', line: 'DJ Ayu till late', date: plus(11), time: '21:00', time2: '02:00', venue: 'Senja Rooftop', btn: 'tickets', url: 'https://megatix.co.id',
        details: 'DJ Ayu b2b DJ Marco - deep house till late under the full moon.', age: '18', price: 'Free entry - members skip the queue' }
    ],
    gallery: [['senja', 'Senja Rooftop'], ['martini', 'Senja Rooftop'], ['party', 'Senja Rooftop'], ['ombak', 'Ombak Beach Club'], ['saffron', 'Saffron & Salt'], ['chef', 'Saffron & Salt'],
              ['fish', 'Saffron & Salt'], ['truffle', 'Saffron & Salt'], ['squidink', 'Saffron & Salt'], ['pasta', 'Kopi Pagi']].map(([n, v], i) => ({ id: 'dg' + i, img: '/demo-guest/' + n + '.jpg', venue: v })),
    places: { 'senja rooftop': { img: '/demo-guest/senja.jpg', area: 'Uluwatu', ig: 'senjarooftop.demo' }, 'ombak beach club': { img: '/demo-guest/ombak.jpg', area: 'Sanur', ig: 'ombakbeachclub.demo' },
              'saffron & salt': { img: '/demo-guest/saffron.jpg', area: 'Seminyak', ig: 'saffronandsalt.demo' }, 'kopi pagi': { img: '/demo-guest/pasta.jpg', area: 'Canggu', ig: 'kopipagi.demo' } }
  };
}

// Demo company with a saved page: add Instagram names it doesn't have yet, and demo photos added since it was saved
const DEMO_NEW_PHOTOS = ['/demo-guest/truffle.jpg', '/demo-guest/squidink.jpg'];
function topUpDemo(c, today){
  const d = demo(today), out = Object.assign({}, c), pl = Object.assign({}, c.places || {});
  Object.keys(d.places).forEach(k => { if (!(pl[k] && pl[k].ig)) pl[k] = Object.assign({}, pl[k] || {}, { ig: d.places[k].ig }); });
  out.places = pl;
  const have = new Set((c.gallery || []).map(g => g && g.img).filter(Boolean));
  out.gallery = (c.gallery || []).concat(d.gallery.filter(g => DEMO_NEW_PHOTOS.includes(g.img) && !have.has(g.img)));
  // Demo events saved before events had details: give them the demo details (once they have their own, theirs win)
  out.events = (c.events || []).map(e => { const de = e && !('details' in e) && d.events.find(x => x.id === e.id); if (!de) return e;
    const x = Object.assign({}, e); ['details', 'age', 'dress', 'price', 'notes', 'time2', 'hl', 'more'].forEach(k => { if (de[k] != null && x[k] == null) x[k] = de[k]; }); return x; });
  // Items saved with the old demo place names (Rooftop, Harbour...) -> the new names, so they show on the right place's page
  const ren = it => { const n = it && DEMO_RENAME[String(it.venue || '').toLowerCase().trim()]; return n ? Object.assign({}, it, { venue: n }) : it; };
  ['slides', 'deals', 'gallery'].forEach(k => { if (Array.isArray(out[k] || c[k])) out[k] = (out[k] || c[k]).map(ren); });
  out.events = out.events.map(ren);
  // New Year's Eve always on the demo (at Senja Rooftop)
  if (!out.events.some(e => e && (e.id === 'de1' || /new year/i.test(e.title || '')))) out.events = [d.events.find(e => e.id === 'de1')].concat(out.events);
  // The old New Year's Eve photo slide is now the event itself in Highlights
  if (out.events.some(e => e && e.id === 'de1' && e.hl)) out.slides = (out.slides || []).filter(sl => sl && sl.id !== 'ds2');
  return out;
}

function hasContent(c){ return !!c && ['slides', 'deals', 'events', 'gallery', 'acts'].some(k => Array.isArray(c[k]) && c[k].length); }

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function dateLabel(ymd){ if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd || '')) return ''; const d = new Date(ymd + 'T12:00:00Z'); return DOW[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; }
function timeLabel(hm){ const m = /^(\d{1,2}):(\d{2})/.exec(hm || ''); if (!m) return ''; let h = +m[1]; const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (m[2] !== '00' ? ':' + m[2] : '') + ap; }

// What the guest page gets: only finished, safe values (photo addresses, labels and button links)
function build(c, ctx){
  const { company, code, venues, today } = ctx, who = ctx.who ? "Hi! It's " + ctx.who + ' here, one of your ' + (ctx.vip ? 'VIP ' : '') + 'members (' + code + ').' : "Hi! I'm a member (" + code + ').';
  const img = it => {
    if (it && it.path) return '/api/gp?a=img&c=' + encodeURIComponent(company) + '&p=' + encodeURIComponent(it.path);
    if (it && /^\/demo-(guest|board)\/[a-z0-9._-]+$/i.test(it.img || '')) return it.img;
    return '';
  };
  const waOf = name => { const v = (venues || []).find(x => x.wa && name && x.name.toLowerCase() === String(name).toLowerCase()) || (venues || []).find(x => x.wa); return v ? v.wa : ''; };
  const DISC = [5, 10, 15, 20, 25, 30, 40, 50];
  const button = (it, what0, disc) => {
    let t = it.btn; const what = what0 + (disc ? ' with my ' + disc + '% member discount' : '');
    // Member discount on a ticket / booking site: show the member code; no code typed in -> members book by WhatsApp (or a call) instead
    const mcode = String(it.code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 30);
    if (disc && (t === 'book' || t === 'tickets') && !mcode) t = 'wa';
    if (disc && (t === 'book' || t === 'tickets') && httpsOk(it.url)) return { href: String(it.url).trim(), label: t === 'tickets' ? 'Get tickets' : 'Book now', kind: t, code: mcode };
    // WhatsApp / Call / Email: the number or address typed on this item, else its place's, else the main contact
    const vOf = name => (venues || []).find(x => name && x.name.toLowerCase() === String(name).toLowerCase()) || {}, main = ctx.contact || {}, own = String(it.to || '').trim();
    if (t === 'wa') { const n = own.replace(/\D/g, '').slice(0, 16) || String(vOf(it.venue).wa || '') || String(main.wa || '') || waOf(it.venue); if (!n && disc && it.btn !== 'wa') { t = 'call'; } else if (!n) return null; else return { href: 'https://wa.me/' + n + '?text=' + encodeURIComponent(who + " I'd love to book " + what + ' - could you help? Thank you!'), label: 'Book on WhatsApp', kind: 'wa', wa: n }; }
    if (t === 'call') { const p = own.replace(/[^\d+]/g, '').slice(0, 20) || String(vOf(it.venue).phone || main.phone || '').replace(/[^\d+]/g, ''); if (!p) return null; return { href: 'tel:' + p, label: 'Call to book', kind: 'call' }; }
    if (t === 'email') { const ok = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : ''; const e = ok(own) || ok(String(vOf(it.venue).email || '')) || ok(String(main.email || '')); if (!e) return null;
      return { href: 'mailto:' + e + '?subject=' + encodeURIComponent('Booking: ' + what) + '&body=' + encodeURIComponent(who + "\n\nI'd love to book " + what + '.\n\nThank you!'), label: 'Email to book', kind: 'email', email: e }; }
    if ((t === 'book' || t === 'tickets') && httpsOk(it.url)) return { href: String(it.url).trim(), label: t === 'tickets' ? 'Get tickets' : 'Book now', kind: t };
    return null;
  };
  const on = k => !(c.off && c.off[k]);
  // A slide saved before slides had a place: work the place out from its words ("at the Rooftop" -> that place)
  const guessPlace = sl => { if (sl.venue) return sl.venue; const t = ((sl.title || '') + ' ' + (sl.line || '')).toLowerCase();
    const v = (venues || []).find(x => x.name && t.includes(String(x.name).toLowerCase())); if (v) return v.name;
    const old = Object.keys(DEMO_RENAME).find(k => t.includes(k)); const n = old && DEMO_RENAME[old];
    return n && (venues || []).some(x => x.name === n) ? n : ''; };
  const slides = on('slides') ? (c.slides || []).filter(s => img(s)).slice(0, 12).map(s => ({ id: str(s.id, 40), img: img(s), title: str(s.title, 60), line: str(s.line, 90), venue: str(guessPlace(s), 40), ev: str(s.ev, 40), btn: button(s, s.title || 'a table') })) : [];
  const deals = (c.deals || []).filter(d => d && d.title).slice(0, 12).map(d => ({ id: str(d.id, 40), img: img(d), title: str(d.title, 60), when: str(d.when, 40), venue: str(d.venue, 40) }));
  const AGES = { all: 'All ages', '18': '18+ only', '21': '21+ only' };
  const events = (c.events || []).filter(e => e && e.title && (!e.date || e.date >= today) && (!e.from || e.from <= today))
    .sort((a, b) => String(a.date || '9999').localeCompare(String(b.date || '9999'))).slice(0, 12)
    .map(e => { const t1 = timeLabel(e.time), t2 = timeLabel(e.time2);
      return { id: str(e.id, 40), img: img(e), title: str(e.title, 60), line: str(e.line, 90), venue: str(e.venue, 40),
        when: [dateLabel(e.date), t1 && t2 ? t1 + ' – ' + t2 : t1].filter(Boolean).join(' · '), disc: DISC.includes(+e.disc) ? +e.disc : 0, btn: button(e, e.title + (e.date ? ' (' + dateLabel(e.date) + ')' : ''), DISC.includes(+e.disc) ? +e.disc : 0),
        // The details pop-up: what's on, ages, dress code, price, anything else
        blast: str(e.blast, 1500).replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim(), details: str(e.details, 300), age: AGES[e.age] || '', dress: str(e.dress, 60), price: str(e.price, 60), notes: str(e.notes, 200), hl: !!e.hl,
        // the icons staff chose for each detail, and their own extra details
        ic: ['details', 'age', 'dress', 'price', 'notes'].reduce((o, k) => { const v = String(((e.ic || {})[k]) || ''); if (/^[a-z]{2,10}$/.test(v)) o[k] = v; return o; }, {}),
        more: (Array.isArray(e.more) ? e.more : []).filter(m => m && m.text).slice(0, 6).map(m => ({ ic: /^[a-z]{2,10}$/.test(String(m.ic || '')) ? m.ic : '', label: str(m.label, 30), text: str(m.text, 120) })) }; });
  // Events switched to "Show in Highlights" go in that place's big photos too (tap -> the details pop-up)
  slides.forEach(s => { if (!s.ev || !events.some(e => e.id === s.ev)) delete s.ev; });   // a slide's See more can go straight to an event - only while that event is still on
  if (on('slides')) events.filter(e => e.hl && e.img).forEach(e => { if (slides.length < 12) slides.push({ id: 'ev-' + e.id, img: e.img, title: e.title, line: e.when, venue: e.venue, btn: null, ev: e.id }); });
  const gallery = (c.gallery || []).map(g => ({ img: img(g), venue: str(g && g.venue, 40) })).filter(g => g.img).slice(0, 120);
  let order = Array.isArray(c.order) ? c.order.filter(k => SECTIONS.includes(k)) : [];
  SECTIONS.forEach(k => { if (!order.includes(k)) order.push(k); });
  order = order.filter(on);
  // Our places: a photo and area for each venue (Guest page > Our places)
  const pl = (c.places && typeof c.places === 'object') ? c.places : {};
  const places = (venues || []).map(v => { const p = pl[String(v.name).toLowerCase()] || {};
    // Menus: pictures (one per page) shown inside the page; older menus may still be a single file or a link
    const menus = (Array.isArray(p.menus) ? p.menus : []).slice(0, 4).map(m => { m = m || {};
      const pages = (Array.isArray(m.pages) ? m.pages : []).slice(0, 12).map(img).filter(Boolean);
      if (!pages.length && m.type !== 'pdf' && (m.path || /\.(jpe?g|png|webp)$/i.test(m.img || ''))) { const one = img(m); if (one) pages.push(one); }
      const url = pages.length ? '' : m.path ? img(m) : httpsOk(m.url) ? String(m.url).trim() : (/^\/demo-guest\/[a-z0-9._-]+$/i.test(m.img || '') ? m.img : '');
      return { name: str(m.name, 30) || 'Menu', pages, url }; }).filter(m => m.pages.length || m.url);
    return { name: v.name, area: str(p.area || v.area || '', 30), img: img(p), ig: igName(p.ig), menus }; });
  // Colours (Guest page > Colours)
  const hex = v => /^#[0-9a-f]{6}$/i.test(v || '') ? v : '';
  const th = c.theme || {}, theme = { top: hex(th.top), acc: hex(th.acc), pg: hex(th.pg) };
  return { order, slides, deals, events, gallery, places, theme, motion: c.motion === true, film: /^[\w-]{11}$/.test(c.film || '') ? c.film : '', video: /^\/[\w\/.-]+\.mp4$/.test(c.video || '') ? c.video : '', videoTall: c.videoTall === true };
}

// The name under the app icon on a guest's phone: phones cut it after about 12 letters ("The Trans Resort Bali" -> "Trans Resort")
const shortName = n => { const t = String(n || '').replace(/^the\s+/i, '').trim(); if (t.length <= 12) return t || 'Members';
  let out = ''; for (const w of t.split(/\s+/)) { if ((out + ' ' + w).trim().length > 12) break; out = (out + ' ' + w).trim(); } return out || t.slice(0, 12); };
module.exports = { shortName, igName, topUpDemo, SECTIONS, paths, demo, hasContent, build, DEMO_VENUES, DEMO_RENAME, isOldDemo, renameDemo };
