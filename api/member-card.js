// Membership guest page - what a guest sees when they scan their own keyring (no login).
// GET /api/member-card?code=5NKGZJ
// Returns only what is safe to show a guest: first name + initial, tier, visit count, perks, a birthday-week flag
// (never the date), what's on (Entertainment Schedule - DJ names and times only, never costs), live menus
// (names, prices, descriptions, allergens - never food cost, ingredients or method) and the venue details the
// managers chose to publish (Membership > Guest page). Never phone, email, notes or birthday.
const L = require('./_lib');

const clean = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
const q = v => encodeURIComponent(v);
const safe = p => p.catch(() => []);
const parse = v => { if (!v) return null; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch (e) { return null; } };

// Local date/time in the venue's time zone (Bali by default)
function localNow(tz){
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  const p = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
  const hh = p.hour === '24' ? '00' : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, hm: `${hh}:${p.minute}` };
}
const addDays = (ymd, n) => { const d = new Date(ymd + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dow = ymd => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date(ymd + 'T12:00:00Z').getUTCDay()];
const toMin = hm => { const m = /^(\d{1,2}):(\d{2})/.exec(hm || ''); return m ? (+m[1]) * 60 + (+m[2]) : null; };
function niceTime(hm){
  const m = toMin(hm); if (m == null) return '';
  let h = Math.floor(m / 60) % 24; const mi = m % 60; const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
  return h + (mi ? ':' + String(mi).padStart(2, '0') : '') + ap;
}
function openState(v, hm){
  const o = toMin(v.opens), c = toMin(v.closes), n = toMin(hm);
  if (o == null || c == null) return { open: null, label: v.hours || '' };
  const isOpen = c > o ? (n >= o && n < c) : (n >= o || n < c);   // closes after midnight
  return isOpen ? { open: true, label: 'until ' + (c === 0 ? 'midnight' : niceTime(v.closes)) }
                : { open: false, label: 'Opens ' + niceTime(v.opens) };
}
// Birthday ('MM-DD') falls in the 7 days around today?
function birthdayWeek(bd, today){
  if (!/^\d{2}-\d{2}$/.test(bd || '')) return false;
  for (let k = -3; k <= 3; k++) if (addDays(today, k).slice(5) === bd) return true;
  return false;
}

// Demo company only: sample content so the demo always looks alive
function demoContent(today){
  const ev = (k, start, end, dj, sub, venue) => ({ date: addDays(today, k), start, end, title: dj, sub, venue });
  return {
    events: [ev(0, '17:00', '23:00', 'Sunset Sessions', 'DJ Kai · deep house into disco', 'Rooftop'),
             ev(1, '19:00', '23:00', 'Latin Night', 'Live band', 'Harbour'),
             ev(2, '20:00', '01:00', 'Full Moon Party', 'DJ Ayu', 'Beach Club'),
             ev(3, '11:00', '15:00', 'Jazz Brunch', 'The Garden Trio', 'Garden'),
             ev(5, '17:00', '22:00', 'Sunset Sessions', 'DJ Marco', 'Rooftop')],
    venues: [{ name: 'Rooftop', opens: '16:00', closes: '01:00', map: 'https://maps.google.com', wa: '6281234567890', phone: '+62 812 3456 7890' },
             { name: 'Harbour', opens: '11:00', closes: '23:00', map: 'https://maps.google.com', wa: '6281234567890', phone: '+62 812 3456 7890' },
             { name: 'Garden', opens: '08:00', closes: '16:00', map: 'https://maps.google.com', wa: '6281234567890', phone: '+62 812 3456 7890' },
             { name: 'Beach Club', opens: '10:00', closes: '00:00', map: 'https://maps.google.com', wa: '6281234567890', phone: '+62 812 3456 7890' }],
    reward: { visits: 50, text: 'Dinner for two on us' },
    menus: {
      food: [{ name: 'Dinner', venue: 'Harbour', sections: [
        { name: 'Starters', dishes: [{ name: 'Burrata, Roasted Tomatoes & Basil Oil', price: 165000, allergens: ['Dairy', 'Gluten'] }, { name: 'Tuna Crudo, Yuzu & Chilli', price: 195000, allergens: ['Fish', 'Soy', 'Sesame'] }] },
        { name: 'Mains', dishes: [{ name: 'Truffle Tagliatelle', price: 210000, allergens: ['Gluten', 'Dairy', 'Egg'] }, { name: 'Grilled Barramundi, Lemon Butter', price: 245000, allergens: ['Fish', 'Dairy'] }, { name: 'Prawn Linguine', price: 230000, allergens: ['Shellfish', 'Gluten'] }] }] }],
      drinks: [{ name: 'Cocktails', venue: 'Rooftop', sections: [
        { name: 'Signatures', dishes: [{ name: 'Ember Spritz', price: 145000, desc: 'Aperol, passionfruit, prosecco' }, { name: 'Tide Margarita', price: 155000, desc: 'Tequila, lime, smoked salt' }, { name: 'Rooftop Negroni', price: 160000, desc: 'Gin, Campari, coconut vermouth' }] }] }]
    }
  };
}

function liveMenus(rows, kind){
  return (rows || []).filter(r => r.section === 'live').map(r => {
    const c = parse(r.content) || {};
    const sections = (c.sections || []).map(s => ({
      name: s.name || '',
      dishes: (s.dishes || []).filter(d => d && d.name).map(d => ({
        name: d.name, price: d.price ? Number(String(d.price).replace(/[^\d.]/g, '')) || null : null,
        desc: d.description && !/^n\/?a$/i.test(String(d.description).trim()) ? String(d.description).slice(0, 200) : '',
        allergens: (d.allergens || []).filter(Boolean).slice(0, 8),
        photo: /^https:\/\//.test(d.photo || '') ? d.photo : ''
      }))
    })).filter(s => s.dishes.length);
    return { name: r.name || (kind === 'food' ? 'Menu' : 'Drinks'), venue: r.area || '', sections };
  }).filter(m => m.sections.length);
}

module.exports = async (req, res) => {
  try {
    const code = clean((req.query && req.query.code) || '');
    if (!code) return L.send(res, 400, { ok: false, reason: 'no code' });
    const k = (await L.db('member_keyrings?select=code,company_id,member_id&code=eq.' + q(code)))[0];
    if (!k) return L.send(res, 200, { ok: false, reason: 'unknown' });
    const co = k.company_id;
    const [cos, settings] = await Promise.all([
      safe(L.db('companies?select=name,code,logo&id=eq.' + q(co))),
      safe(L.db('app_settings?select=key,value&company_id=eq.' + q(co) + '&key=in.(member_perks,member_page)'))
    ]);
    const company = cos[0] || {};
    const isDemo = company.code === 'MAVIS';
    const brand = company.name || 'Members Club';
    const logo = /^(https:\/\/|data:image\/)/.test(company.logo || '') && String(company.logo).length < 400000 ? company.logo : '';
    const set = {}; settings.forEach(s => { set[s.key] = parse(s.value); });
    const page = set.member_page || {};
    const tz = page.tz || 'Asia/Makassar';
    const now = localNow(tz);
    const demo = isDemo ? demoContent(now.date) : null;

    if (!k.member_id) return L.send(res, 200, { ok: true, blank: true, brand, logo });
    const m = (await L.db('members?select=id,name,tier,birthday,created_at&id=eq.' + q(k.member_id)))[0];
    if (!m) return L.send(res, 200, { ok: true, blank: true, brand, logo });

    const weekEnd = addDays(now.date, 6);
    const [visits, stages, bookings, kMenus, bMenus] = await Promise.all([
      safe(L.db('member_visits?select=venue&member_id=eq.' + q(m.id) + '&limit=5000')),
      safe(L.db('dj_stages?select=id,name&company_id=eq.' + q(co))),
      safe(L.db('dj_bookings?select=stage_id,date,start_time,end_time,dj_name,type&company_id=eq.' + q(co) + '&date=gte.' + now.date + '&date=lte.' + weekEnd + '&order=date.asc,start_time.asc&limit=200')),
      safe(L.db('kitchen_menus?select=name,area,section,content&company_id=eq.' + q(co) + '&section=eq.live')),
      safe(L.db('bar_menus?select=name,area,section,content&company_id=eq.' + q(co) + '&section=eq.live'))
    ]);

    // Card
    const byVenue = {};
    visits.forEach(v => { const n = v.venue || 'Other'; byVenue[n] = (byVenue[n] || 0) + 1; });
    const favourite = Object.keys(byVenue).sort((a, b) => byVenue[b] - byVenue[a])[0] || '';
    const parts = String(m.name || '').trim().split(/\s+/);
    const first = parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
    const tier = m.tier === 'vip' ? 'vip' : 'member';
    const perksAll = set.member_perks || {};
    const perks = Array.isArray(perksAll[tier]) ? perksAll[tier].slice(0, 8) : [];

    // What's on: Entertainment Schedule (DJ name, area, times - nothing else)
    const stageName = {}; stages.forEach(s => { stageName[s.id] = s.name; });
    let events = bookings.filter(b => b.dj_name).map(b => ({
      date: b.date, start: (b.start_time || '').slice(0, 5), end: (b.end_time || '').slice(0, 5),
      title: b.dj_name, sub: b.type === 'takeover' ? 'Takeover' : 'Live DJ', venue: stageName[b.stage_id] || ''
    }));
    if (!events.length && demo) events = demo.events;
    const fmtEv = e => ({ day: dow(e.date), date: e.date, title: e.title, sub: e.sub, venue: e.venue,
      time: e.start ? niceTime(e.start) + (e.end ? ' - ' + niceTime(e.end) : '') : '' });
    const tonight = events.filter(e => e.date === now.date && !(e.end && toMin(e.end) > toMin(e.start || '00:00') && toMin(e.end) <= toMin(now.hm))).map(fmtEv);
    const week = [];
    events.filter(e => e.date > now.date).forEach(e => { if (!week.find(w => w.date === e.date)) week.push(fmtEv(e)); });

    // Menus
    let menus = { food: liveMenus(kMenus, 'food'), drinks: liveMenus(bMenus, 'drinks') };
    if (demo && !menus.food.length && !menus.drinks.length) menus = demo.menus;

    // Venues + rewards (Membership > Guest page)
    let venues = Array.isArray(page.venues) && page.venues.length ? page.venues : (demo ? demo.venues : []);
    venues = venues.filter(v => v && v.name).slice(0, 12).map(v => Object.assign({ name: v.name, map: v.map || '', wa: String(v.wa || '').replace(/\D/g, ''), phone: v.phone || '' }, openState(v, now.hm)));
    const rw = page.reward && page.reward.visits ? page.reward : (demo ? demo.reward : null);
    const reward = rw && Number(rw.visits) > 0 ? { target: Number(rw.visits), text: String(rw.text || '').slice(0, 80), left: Math.max(0, Number(rw.visits) - visits.length) } : null;

    return L.send(res, 200, {
      ok: true, brand, logo, code, first, tier, visits: visits.length, favourite,
      since: new Date(m.created_at).getFullYear(), perks,
      birthdayWeek: birthdayWeek(m.birthday, now.date),
      tonight: tonight.slice(0, 3), week: week.slice(0, 6), menus, venues, reward
    });
  } catch (e) {
    console.error(e);
    return L.send(res, 500, { ok: false, reason: 'error' });
  }
};
