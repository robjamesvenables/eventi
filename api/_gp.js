// Guest page marketing content (photo slides, daily deals, coming-up events, gallery) - shared by
// member-card (what the guest sees), gp-img (the photos) and gp-hit (the numbers).
// Content lives in the guest_page table, one row per company: { order, off, slides, deals, events, gallery }.

const SECTIONS = ['tonight', 'deals', 'events', 'gallery', 'venues'];
const httpsOk = u => /^https:\/\/[^\s"'<>]+$/i.test(String(u || '').trim());
const str = (v, n) => String(v == null ? '' : v).slice(0, n);

// Every stored photo path in the content (so gp-img only ever serves photos that are really on the page)
function paths(c){
  const out = [];
  ['slides', 'deals', 'events', 'gallery'].forEach(k => (Array.isArray(c && c[k]) ? c[k] : []).forEach(it => { if (it && it.path) out.push(String(it.path)); }));
  Object.values((c && c.places) || {}).forEach(p => { if (p && p.path) out.push(String(p.path)); });
  return out;
}

// Demo company venues: four made-up places around Bali (older demo data used Rooftop / Harbour / Garden / Beach Club)
const DEMO_VENUES = [
  { name: 'Senja Rooftop', area: 'Uluwatu', opens: '16:00', closes: '01:00' },
  { name: 'Ombak Beach Club', area: 'Sanur', opens: '10:00', closes: '00:00' },
  { name: 'Saffron & Salt', area: 'Seminyak', opens: '17:00', closes: '23:00' },
  { name: 'Kopi Pagi', area: 'Canggu', opens: '07:00', closes: '17:00' }
].map(v => Object.assign(v, { map: 'https://maps.google.com', wa: '6281234567890', phone: '+62 812 3456 7890' }));
const DEMO_RENAME = { 'rooftop': 'Senja Rooftop', 'beach club': 'Ombak Beach Club', 'harbour': 'Saffron & Salt', 'garden': 'Kopi Pagi' };
const isOldDemo = list => Array.isArray(list) && list.some(v => v && DEMO_RENAME[String(v.name || '').toLowerCase().trim()]);
// Demo only: swap any old venue name for its new made-up place (keeps the saved hours, map and WhatsApp)
const renameDemo = list => (list || []).map(v => { const n = DEMO_RENAME[String((v && v.name) || '').toLowerCase().trim()]; if (!n) return v; const d = DEMO_VENUES.find(x => x.name === n); return Object.assign({}, v, { name: n, area: v.area || d.area }); });

// Demo company: a page that always looks alive
function demo(today){
  const y = +today.slice(0, 4);
  const nye = (today > y + '-12-31' ? y + 1 : y) + '-12-31', xmas = (today > y + '-12-25' ? y + 1 : y) + '-12-25';
  const plus = n => { const d = new Date(today + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  return {
    order: SECTIONS.slice(), off: {},
    slides: [
      { id: 'ds1', img: '/demo-guest/martini.jpg', title: '2 for 1 cocktails', line: 'Every day 5–7pm', venue: 'Senja Rooftop' },
      { id: 'ds2', img: '/demo-guest/party.jpg', title: "New Year's Eve", line: 'Tickets on sale now', venue: 'Senja Rooftop', btn: 'tickets', url: 'https://megatix.co.id' },
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
      { id: 'de1', img: '/demo-guest/party.jpg', title: "New Year's Eve", line: 'Fireworks, DJs, free-flow from Rp 1.5m', date: nye, time: '20:00', venue: 'Senja Rooftop', btn: 'tickets', url: 'https://megatix.co.id' },
      { id: 'de2', img: '/demo-guest/fish.jpg', title: 'Christmas Lunch', line: 'Four courses by the water', date: xmas, time: '12:00', venue: 'Saffron & Salt', btn: 'wa' },
      { id: 'de3', img: '/demo-guest/chef.jpg', title: "Chef's Table", line: 'Seven courses, 12 seats only', date: plus(9), time: '19:00', venue: 'Saffron & Salt', btn: 'wa' },
      { id: 'de4', img: '/demo-guest/party.jpg', title: 'Full Moon Rooftop', line: 'DJ Ayu till late', date: plus(11), time: '21:00', venue: 'Senja Rooftop', btn: 'tickets', url: 'https://megatix.co.id' }
    ],
    gallery: [['senja', 'Senja Rooftop'], ['martini', 'Senja Rooftop'], ['party', 'Senja Rooftop'], ['ombak', 'Ombak Beach Club'], ['saffron', 'Saffron & Salt'], ['chef', 'Saffron & Salt'],
              ['fish', 'Saffron & Salt'], ['pasta', 'Kopi Pagi']].map(([n, v], i) => ({ id: 'dg' + i, img: '/demo-guest/' + n + '.jpg', venue: v })),
    places: { 'senja rooftop': { img: '/demo-guest/senja.jpg', area: 'Uluwatu' }, 'ombak beach club': { img: '/demo-guest/ombak.jpg', area: 'Sanur' },
              'saffron & salt': { img: '/demo-guest/saffron.jpg', area: 'Seminyak' }, 'kopi pagi': { img: '/demo-guest/pasta.jpg', area: 'Canggu' } }
  };
}

function hasContent(c){ return !!c && ['slides', 'deals', 'events', 'gallery'].some(k => Array.isArray(c[k]) && c[k].length); }

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function dateLabel(ymd){ if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd || '')) return ''; const d = new Date(ymd + 'T12:00:00Z'); return DOW[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; }
function timeLabel(hm){ const m = /^(\d{1,2}):(\d{2})/.exec(hm || ''); if (!m) return ''; let h = +m[1]; const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (m[2] !== '00' ? ':' + m[2] : '') + ap; }

// What the guest page gets: only finished, safe values (photo addresses, labels and button links)
function build(c, ctx){
  const { company, code, venues, today } = ctx;
  const img = it => {
    if (it && it.path) return '/api/gp?a=img&c=' + encodeURIComponent(company) + '&p=' + encodeURIComponent(it.path);
    if (it && /^\/demo-(guest|board)\/[a-z0-9._-]+$/i.test(it.img || '')) return it.img;
    return '';
  };
  const waOf = name => { const v = (venues || []).find(x => x.wa && name && x.name.toLowerCase() === String(name).toLowerCase()) || (venues || []).find(x => x.wa); return v ? v.wa : ''; };
  const button = (it, what) => {
    const t = it.btn;
    if (t === 'wa') { const n = waOf(it.venue); if (!n) return null; return { href: 'https://wa.me/' + n + '?text=' + encodeURIComponent("Hi! I'm a member (" + code + ") and I'd like to book: " + what), label: 'Book on WhatsApp', kind: 'wa' }; }
    if ((t === 'book' || t === 'tickets') && httpsOk(it.url)) return { href: String(it.url).trim(), label: t === 'tickets' ? 'Get tickets' : 'Book now', kind: t };
    return null;
  };
  const on = k => !(c.off && c.off[k]);
  // A slide saved before slides had a place: work the place out from its words ("at the Rooftop" -> that place)
  const guessPlace = sl => { if (sl.venue) return sl.venue; const t = ((sl.title || '') + ' ' + (sl.line || '')).toLowerCase();
    const v = (venues || []).find(x => x.name && t.includes(String(x.name).toLowerCase())); if (v) return v.name;
    const old = Object.keys(DEMO_RENAME).find(k => t.includes(k)); const n = old && DEMO_RENAME[old];
    return n && (venues || []).some(x => x.name === n) ? n : ''; };
  const slides = on('slides') ? (c.slides || []).filter(s => img(s)).slice(0, 12).map(s => ({ id: str(s.id, 40), img: img(s), title: str(s.title, 60), line: str(s.line, 90), venue: str(guessPlace(s), 40), btn: button(s, s.title || 'a table') })) : [];
  const deals = (c.deals || []).filter(d => d && d.title).slice(0, 12).map(d => ({ id: str(d.id, 40), img: img(d), title: str(d.title, 60), when: str(d.when, 40), venue: str(d.venue, 40) }));
  const events = (c.events || []).filter(e => e && e.title && (!e.date || e.date >= today) && (!e.from || e.from <= today))
    .sort((a, b) => String(a.date || '9999').localeCompare(String(b.date || '9999'))).slice(0, 12)
    .map(e => ({ id: str(e.id, 40), img: img(e), title: str(e.title, 60), line: str(e.line, 90), venue: str(e.venue, 40),
      when: [dateLabel(e.date), timeLabel(e.time)].filter(Boolean).join(' · '), btn: button(e, e.title + (e.date ? ' (' + dateLabel(e.date) + ')' : '')) }));
  const gallery = (c.gallery || []).map(g => ({ img: img(g), venue: str(g && g.venue, 40) })).filter(g => g.img).slice(0, 60);
  let order = Array.isArray(c.order) ? c.order.filter(k => SECTIONS.includes(k)) : [];
  SECTIONS.forEach(k => { if (!order.includes(k)) order.push(k); });
  order = order.filter(on);
  // Our places: a photo and area for each venue (Guest page > Our places)
  const pl = (c.places && typeof c.places === 'object') ? c.places : {};
  const places = (venues || []).map(v => { const p = pl[String(v.name).toLowerCase()] || {}; return { name: v.name, area: str(p.area || v.area || '', 30), img: img(p) }; });
  // Colours (Guest page > Colours)
  const hex = v => /^#[0-9a-f]{6}$/i.test(v || '') ? v : '';
  const th = c.theme || {}, theme = { top: hex(th.top), acc: hex(th.acc), pg: hex(th.pg) };
  return { order, slides, deals, events, gallery, places, theme };
}

module.exports = { SECTIONS, paths, demo, hasContent, build, DEMO_VENUES, DEMO_RENAME, isOldDemo, renameDemo };
