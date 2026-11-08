// Membership guest page - what a guest sees when they scan their own keyring (no login).
// GET /api/member-card?code=5NKGZJ
// Returns only what is safe to show a guest: first name + initial, tier, visit count, perks, a birthday-week flag
// (never the date), what's on (Entertainment Schedule - DJ names and times only, never costs), live menus
// (names, prices, descriptions, allergens - never food cost, ingredients or method) and the venue details the
// managers chose to publish (Membership > Guest page). Never phone, email, notes or birthday.
const L = require('./_lib');
const GP = require('./_gp');
const PR = require('./_prospects');

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
    events: [ev(0, '17:00', '23:00', 'Sunset Sessions', 'DJ Kai · deep house into disco', 'Senja Rooftop'),
             ev(1, '19:00', '23:00', 'Latin Night', 'Live band', 'Saffron & Salt'),
             ev(2, '20:00', '01:00', 'Pool Party', 'DJ Ayu', 'Ombak Beach Club'),
             ev(3, '09:00', '12:00', 'Acoustic Breakfast', 'The Garden Trio', 'Kopi Pagi'),
             ev(5, '17:00', '22:00', 'Sunset Sessions', 'DJ Marco', 'Senja Rooftop')],
    venues: GP.DEMO_VENUES,
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

// Bottom bar (Book + Contact): a room booking link, one booking link per place, and the venue's contact rows.
// Only clean values get through - https links, digits for WhatsApp, a real-looking email, an Instagram name.
const https = u => /^https:\/\/[^\s"'<>]+$/i.test(String(u || '').trim()) ? String(u).trim().slice(0, 400) : '';
const waOf = w => String(w || '').replace(/\D/g, '').slice(0, 16);
const phoneOf = p => String(p || '').replace(/[^\d+ ]/g, '').trim().slice(0, 24);
const cleanContact = c => { c = c || {}; return { phone: String(c.phone || '').replace(/[^\d+ ]/g, '').trim().slice(0, 24), wa: String(c.wa || '').replace(/\D/g, '').slice(0, 16),
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(c.email || '').trim()) ? String(c.email).trim().slice(0, 120) : '', map: https(c.map), ig: String(c.ig || '').replace(/[^\w.]/g, '').slice(0, 40) }; };

// Sales demo keyring (see _prospects.js): the same page a member gets, filled with that venue's own content
function prospectCard(pro, code, ov){
  const now = localNow('Asia/Makassar');
  // Linked to the back office (the demo company saved this prospect's page there): what the team saved, else the built-in demo
  if (ov) { const pg = ov.page || {};
    pro = Object.assign({}, pro, { content: ov.content ? () => ov.content : pro.content, acts: ov.content && Array.isArray(ov.content.acts) ? ov.content.acts.filter(a => a && a.title && Array.isArray(a.every)) : pro.acts,
      venues: Array.isArray(pg.venues) && pg.venues.length ? pg.venues.filter(v => v && v.name).slice(0, 12) : pro.venues,
      contact: pg.contact || pro.contact, stay: pg.stay != null ? pg.stay : pro.stay, stayWa: pg.stayWa != null ? pg.stayWa : pro.stayWa, stayPhone: pg.stayPhone != null ? pg.stayPhone : pro.stayPhone,
      reward: pg.reward && pg.reward.visits ? { target: +pg.reward.visits, text: String(pg.reward.text || '') } : pg.reward === null ? null : pro.reward });
    const pk = ov.perks && ov.perks[pro.tier === 'vip' ? 'vip' : 'member'];
    if (Array.isArray(pk)) pro.perks = pk.slice(0, 8).map(x => String(x || '').slice(0, 60)), pro.perkIcons = pro.perks.map((x, i) => { const v = String((((ov.perks.icons || {})[pro.tier === 'vip' ? 'vip' : 'member']) || [])[i] || ''); return /^[a-z]{2,10}$/.test(v) ? v : ''; });
  }
  const venues = pro.venues.map(v => Object.assign({ name: v.name, area: v.area || '', email: v.email || '', map: v.map || '', review: v.review || '', wa: v.wa || '', phone: v.phone || '', book: https(v.book), own: !!v.own, ig: String(v.ig || '').replace(/[^\w.]/g, '').slice(0, 40) }, openState(v, now.hm)));
  const events = [];
  for (let i = 0; i <= 6; i++) {
    const day = addDays(now.date, i), wd = new Date(day + 'T12:00:00Z').getUTCDay();
    (pro.acts || []).forEach(a => { if (a.every.includes(wd)) events.push({ date: day, start: a.start, end: a.end, title: a.title, sub: a.line, venue: a.venue }); });
  }
  const fmtEv = e => ({ day: dow(e.date), date: e.date, title: e.title, sub: e.sub, venue: e.venue, time: e.start ? niceTime(e.start) + (e.end ? ' - ' + niceTime(e.end) : '') : '' });
  const tonight = events.filter(e => e.date === now.date && !(e.end && toMin(e.end) > toMin(e.start || '00:00') && toMin(e.end) <= toMin(now.hm))).map(fmtEv);
  const week = events.filter(e => e.date > now.date).map(fmtEv);
  const gp = GP.build(pro.content(now.date), { company: (ov && ov.co) || 'demo', code, venues, today: now.date, who: pro.first, vip: pro.tier === 'vip', contact: cleanContact(pro.contact) });
  const rv = venues.find(v => v.review);
  return { ok: true, brand: pro.brand, logo: pro.logo, code, first: pro.first, tier: pro.tier, visits: pro.visits, favourite: pro.favourite, gp,
    since: pro.since, perks: pro.perks, perkIcons: pro.perkIcons, offers: true, reviewAsk: rv ? { venue: rv.name, date: addDays(now.date, -1), when: 'yesterday', demo: true } : null,
    birthdayWeek: false, tonight, week, menus: { food: [], drinks: [] }, venues, stay: https(pro.stay), stayWa: waOf(pro.stayWa), stayPhone: phoneOf(pro.stayPhone), contact: cleanContact(pro.contact),
    reward: pro.reward ? { target: pro.reward.target, text: pro.reward.text, done: Math.min(pro.visits, pro.reward.target), left: Math.max(0, pro.reward.target - pro.visits), round: 0 } : null };
}

module.exports = async (req, res) => {
  try {
    const code = clean((req.query && req.query.code) || '');
    if (!code) return L.send(res, 400, { ok: false, reason: 'no code' });
    const pro = PR.get(code);
    if (pro) {   // sales demo keyring: that venue's own page, no database
      // The demo company may have this prospect's page saved in its back office (Design your page): then the page is what they saved
      let ms = null, ov = null;
      try {
        const kk = (await L.db('member_keyrings?select=company_id&code=eq.' + q(code)))[0];
        if (kk) {
          const [sts, gps] = await Promise.all([
            safe(L.db('app_settings?select=key,value&company_id=eq.' + q(kk.company_id) + '&key=in.(mk_settings,member_page,member_perks)')),
            safe(L.db('guest_page?select=content&company_id=eq.' + q(kk.company_id)))]);
          const set = {}; sts.forEach(r => { set[r.key] = parse(r.value); });
          ms = set.mk_settings;
          const key = PR.keyOf(code), gc = gps[0] && gps[0].content;
          if (key && gc && gc.as === key) ov = { co: kk.company_id, content: gc, page: set.member_page && set.member_page.as === key ? set.member_page : null, perks: set.member_page && set.member_page.as === key ? set.member_perks : null };
        }
      } catch (e) {}
      const card = prospectCard(pro, code, ov);
      // Mavis Club network: only when the demo company switched it on (Members Club > Settings). Off = nothing shows.
      if (ms && ms.club && ms.club.on && Array.isArray(pro.club)) card.club = PR.club(pro.club, card.first);
      return L.send(res, 200, card);
    }
    const k = (await L.db('member_keyrings?select=code,company_id,member_id&code=eq.' + q(code)))[0];
    if (!k) return L.send(res, 200, { ok: false, reason: 'unknown' });
    const co = k.company_id;
    const [cos, settings, gpRows] = await Promise.all([
      safe(L.db('companies?select=name,code,logo&id=eq.' + q(co))),
      safe(L.db('app_settings?select=key,value&company_id=eq.' + q(co) + '&key=in.(member_perks,member_page,mk_rewards)')),
      safe(L.db('guest_page?select=content&company_id=eq.' + q(co)))
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
    const m = (await L.db('members?select=id,name,tier,birthday,created_at,consent&id=eq.' + q(k.member_id)))[0];
    if (!m) return L.send(res, 200, { ok: true, blank: true, brand, logo });

    const weekEnd = addDays(now.date, 6);
    const [visits, stages, bookings] = await Promise.all([
      safe(L.db('member_visits?select=venue,visit_date&member_id=eq.' + q(m.id) + '&limit=5000')),
      safe(L.db('dj_stages?select=id,name&company_id=eq.' + q(co))),
      safe(L.db('dj_bookings?select=stage_id,date,start_time,end_time,dj_name,type&company_id=eq.' + q(co) + '&date=gte.' + now.date + '&date=lte.' + weekEnd + '&order=date.asc,start_time.asc&limit=200')),
    ]);

    // Card
    const byVenue = {};
    visits.forEach(v => { const n = v.venue || 'Other'; byVenue[n] = (byVenue[n] || 0) + 1; });
    let favourite = Object.keys(byVenue).sort((a, b) => byVenue[b] - byVenue[a])[0] || '';
    if (isDemo && GP.DEMO_RENAME[favourite.toLowerCase()]) favourite = GP.DEMO_RENAME[favourite.toLowerCase()];
    const parts = String(m.name || '').trim().split(/\s+/);
    const first = parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
    const tier = m.tier === 'vip' ? 'vip' : 'member';
    // Same starting perks the app shows until a manager changes them (Membership > Perks, reward and venues)
    const savedPerks = set.member_perks && (set.member_perks.member || set.member_perks.vip) ? set.member_perks : null;
    const perksAll = savedPerks || { member: ['Welcome drink on your first visit', 'Birthday dessert on us'], vip: ['10% off food at all our venues', 'Birthday dessert on us', 'Skip the queue on busy nights'], icons: { member: ['glass', 'cake'], vip: ['pct', 'cake', 'star'] } };
    const perks = Array.isArray(perksAll[tier]) ? perksAll[tier].slice(0, 8).map(x => String(x || '').slice(0, 60)) : [];
    const perkIcons = perks.map((x, i) => { const v = String(((perksAll.icons || {})[tier] || [])[i] || ''); return /^[a-z]{2,10}$/.test(v) ? v : ''; });   // icons a manager picked

    // What's on: Entertainment Schedule (DJ name, area, times - nothing else)
    const stageName = {}; stages.forEach(s => { stageName[s.id] = s.name; });
    let events = bookings.filter(b => b.dj_name).map(b => ({
      date: b.date, start: (b.start_time || '').slice(0, 5), end: (b.end_time || '').slice(0, 5),
      title: b.dj_name, sub: b.type === 'takeover' ? 'Takeover' : 'Live DJ', venue: (isDemo && GP.DEMO_RENAME[String(stageName[b.stage_id] || '').toLowerCase().trim()]) || stageName[b.stage_id] || ''
    }));
    // Who's playing, typed in on the Guest page (for places that don't use the Entertainment Schedule): a date, or every week on set days
    const gpRaw = gpRows[0] && gpRows[0].content;
    const acts = Array.isArray(gpRaw && gpRaw.acts) ? gpRaw.acts : [];
    const tm = v => /^\d{2}:\d{2}$/.test(v || '') ? v : '';
    for (let i = 0; i <= 6; i++) {
      const day = addDays(now.date, i), wd = new Date(day + 'T12:00:00Z').getUTCDay();
      acts.forEach(a => { if (!a || !a.title) return;
        const on = a.date ? a.date === day : Array.isArray(a.every) && a.every.map(Number).includes(wd);
        if (on) events.push({ date: day, start: tm(a.start), end: tm(a.end), title: String(a.title).slice(0, 60), sub: String(a.line || '').slice(0, 60), venue: String(a.venue || '').slice(0, 40) });
      });
    }
    events.sort((a, b) => (a.date + (a.start || '')).localeCompare(b.date + (b.start || '')));
    if (!events.length && demo) events = demo.events;
    const fmtEv = e => ({ day: dow(e.date), date: e.date, title: e.title, sub: e.sub, venue: e.venue,
      time: e.start ? niceTime(e.start) + (e.end ? ' - ' + niceTime(e.end) : '') : '' });
    const tonight = events.filter(e => e.date === now.date && !(e.end && toMin(e.end) > toMin(e.start || '00:00') && toMin(e.end) <= toMin(now.hm))).map(fmtEv);
    const week = [];
    events.filter(e => e.date > now.date).forEach(e => { if (!week.find(w => w.date === e.date && w.venue === e.venue)) week.push(fmtEv(e)); });

    // Menus
    // Menus are not on the guest page (it's for what's on and offers)
    const menus = { food: [], drinks: [] };

    // Venues + rewards (Membership > Guest page)
    let venues = Array.isArray(page.venues) && page.venues.length ? page.venues : (demo ? demo.venues : []);
    if (demo && GP.isOldDemo(venues)) venues = GP.renameDemo(venues);
    if (demo) venues = venues.map(v => { const dv = v && GP.DEMO_VENUES.find(x => x.name === v.name); return dv && (!v.email || !v.review) ? Object.assign({}, v, { email: v.email || dv.email, review: v.review || dv.review }) : v; });   // demo: sample emails + review links
    venues = venues.filter(v => v && v.name).slice(0, 12).map(v => Object.assign({ name: v.name, area: String(v.area || '').slice(0, 30), email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v.email || '').trim()) ? String(v.email).trim().slice(0, 120) : '', map: v.map || '', review: /^https:\/\/[^\s"'<>]+$/i.test(String(v.review || '').trim()) ? String(v.review).trim().slice(0, 400) : '', wa: String(v.wa || '').replace(/\D/g, ''), phone: v.phone || '', book: https(v.book), own: !!v.own, ig: String(v.ig || '').replace(/[^\w.]/g, '').slice(0, 40) }, openState(v, now.hm)));
    // Google review ask: they were checked in at a place in the last 2 days (demo: always, so it can be shown)
    let reviewAsk = null;
    const lastV = visits.filter(v => v.visit_date && v.visit_date >= addDays(now.date, -2) && v.visit_date <= now.date).sort((a, b) => String(b.visit_date).localeCompare(String(a.visit_date)))[0];
    const vr = name => venues.find(v => v.review && name && v.name.toLowerCase() === String(name).toLowerCase());
    if (lastV && vr(lastV.venue)) reviewAsk = { venue: vr(lastV.venue).name, date: lastV.visit_date, when: lastV.visit_date === now.date ? 'today' : lastV.visit_date === addDays(now.date, -1) ? 'yesterday' : 'recent' };
    else if (demo) { const v = venues.find(x => x.review); if (v) reviewAsk = { venue: v.name, date: addDays(now.date, -1), when: 'yesterday', demo: true }; }
    const rw = page.reward && page.reward.visits ? page.reward : (demo ? demo.reward : null);
    // Rounds: every time staff tap "Reward given" the count starts again (Mavis Club > member > Reward given)
    const given = Array.isArray((set.mk_rewards || {})[m.id]) ? set.mk_rewards[m.id].length : 0;
    const tgt = rw ? Number(rw.visits) : 0, inRound = tgt ? Math.max(0, visits.length - given * tgt) : 0;
    const reward = rw && tgt > 0 ? { target: tgt, text: String(rw.text || '').slice(0, 80), done: Math.min(inRound, tgt), left: Math.max(0, tgt - inRound), round: given } : null;

    // Marketing: photo slides, daily deals, coming up, gallery (Membership > Guest page)
    let gpc = gpRows[0] && gpRows[0].content;
    if (!GP.hasContent(gpc) && demo) gpc = Object.assign(GP.demo(now.date), gpc && gpc.order ? { order: gpc.order, off: gpc.off || {} } : {});
    else if (demo && gpc) gpc = GP.topUpDemo(gpc, now.date);   // a saved demo page still gets newer demo extras (Instagram names, new photos)
    const gp = GP.build(gpc || {}, { company: co, code, venues, today: now.date, who: first, vip: tier === 'vip', contact: cleanContact(page.contact) });

    // The numbers: one page open, and a view for every card shown (not when staff preview it)
    if (!(req.query && req.query.pv)) {
      const rows = [{ company_id: co, item: 'page', kind: 'open' }]
        .concat(gp.slides.concat(gp.deals, gp.events).map(x => ({ company_id: co, item: x.id, kind: 'view' })));
      try { await L.db('guest_page_hits', { method: 'POST', body: rows, headers: { Prefer: 'return=minimal' } }); } catch (e) {}
    }

    return L.send(res, 200, {
      ok: true, brand, logo, code, first, tier, visits: visits.length, favourite, gp,
      since: new Date(m.created_at).getFullYear(), perks, perkIcons, offers: m.consent === true, reviewAsk,
      birthdayWeek: birthdayWeek(m.birthday, now.date),
      tonight: tonight.slice(0, 12), week: week.slice(0, 40), menus, venues, reward, stay: https(page.stay), stayWa: waOf(page.stayWa), stayPhone: phoneOf(page.stayPhone), contact: cleanContact(page.contact)
    });
  } catch (e) {
    console.error(e);
    return L.send(res, 500, { ok: false, reason: 'error' });
  }
};
