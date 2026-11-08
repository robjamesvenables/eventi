// Sales demos: keyrings sent to venues we're talking to. Each code shows a guest page made for THAT venue
// (their name, colours, photos, places) - built in here, no company or database rows needed.
// Photos live in /demo-guest/p-<venue>-*.jpg. Perks, deals and dates are made-up examples for the demo.
const addDays = (ymd, n) => { const d = new Date(ymd + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const nextDow = (today, wd) => { for (let i = 1; i <= 7; i++) { const d = addDays(today, i); if (new Date(d + 'T12:00:00Z').getUTCDay() === wd) return d; } return addDays(today, 7); };
const year = today => { const y = +today.slice(0, 4), xmas = y + '-12-25'; return today > xmas ? y + 1 : y; };

const SHELTER_BOOK = 'https://www.sevenrooms.com/explore/shelterpererenan/reservations/create/search';
const sh = n => '/demo-guest/p-shelter-' + n + '.jpg';

const P = {
  shelter: {
    brand: 'Shelter', logo: '/demo-guest/p-shelter-logo.png', first: 'Stephen M.', tier: 'vip', visits: 12, since: 2024, favourite: 'Shelter Pererenan',
    perks: ['Glass of house wine with every dinner', 'First pick of tables for Shelter Sessions', 'Birthday dessert from the fire', 'Skip the wait for Sunday BBQ'],
    perkIcons: ['glass', 'ticket', 'cake', 'star'],
    reward: { target: 15, text: "Chef's fire menu for two" },
    venues: [
      { name: 'Shelter Pererenan', area: 'Pererenan', opens: '12:00', closes: '00:00', map: 'https://maps.app.goo.gl/Z9h6Ns2VTGCUGSeH7', wa: '6282340040199', phone: '+62 823 4004 0199', email: 'info@shelterbali.com', review: 'https://maps.app.goo.gl/Z9h6Ns2VTGCUGSeH7' },
      { name: 'Shelter Uluwatu', area: 'Coming soon', email: 'info@shelterbali.com' }
    ],
    acts: [
      { title: 'Sunday BBQ', line: 'Whole fish and meats over the fire', every: [0], start: '12:00', end: '17:00', venue: 'Shelter Pererenan' },
      { title: 'Fireside acoustic', line: 'Live music by the fire pit', every: [3, 5, 6], start: '19:00', end: '22:00', venue: 'Shelter Pererenan' }
    ],
    content: today => {
      const y = year(today);
      return {
        theme: { top: '#3F5A4F', acc: '#B5643C', pg: '#F4F1EA' },
        slides: [
          { id: 'ps1', img: sh('fire'), title: 'Grilled over fire', line: 'Whole fish on the open pit', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps2', img: sh('scallops'), title: 'Wood roasted moon scallops', line: 'Lemon butter, chilli salt', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps3', img: sh('drink'), title: 'The Sinaloa', line: 'Mezcal, reposado, agave, cucumber', venue: 'Shelter Pererenan' },
          { id: 'ps4', img: sh('coals'), title: 'Charred over coals, by hand', line: 'Wood-fired Middle Eastern', venue: 'Shelter Uluwatu' }
        ],
        deals: [
          { id: 'pd1', img: sh('drink'), title: 'Mezcal hour · 2 for 1 Sinaloa', when: 'Daily · 5–7pm', venue: 'Shelter Pererenan' },
          { id: 'pd2', img: sh('barra'), title: 'Long lunch · 3 courses Rp 395k', when: 'Mon–Fri · 12–3pm', venue: 'Shelter Pererenan' },
          { id: 'pd3', img: sh('fire'), title: 'Sunday BBQ · sharing feast', when: 'Sundays · from 12pm', venue: 'Shelter Pererenan' }
        ],
        events: [
          { id: 'pe1', img: sh('coals'), title: 'Shelter Sessions Vol. 12', line: 'Guest chef, one night only', date: addDays(today, 9), time: '18:00', time2: '23:00', venue: 'Shelter Pererenan', btn: 'tickets', url: SHELTER_BOOK, hl: true,
            details: 'A guest chef joins the Shelter team at the fire for one night - a set menu cooked over wood, with paired drinks.', price: 'Set menu, paired drinks available', notes: 'Members get first pick of tables.' },
          { id: 'pe2', img: sh('fire'), title: 'Bonfire Sessions', line: 'Fireside night with Charlie Pretet', date: addDays(today, 4), time: '19:00', time2: '23:00', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK,
            details: 'Live music around the fire pit, wood-fired sharing plates and the bar open late.' },
          { id: 'pe3', img: sh('octopus'), title: 'Christmas by the fire', line: 'Long table lunch, cooked over wood', date: y + '-12-25', time: '12:00', time2: '17:00', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK,
            details: 'A Christmas long lunch from the fire - whole roasted fish, slow cooked meats and all the sides.' },
          { id: 'pe4', img: sh('flatbread'), title: "New Year's Eve", line: 'Fire, feasting and a late bar', date: y + '-12-31', time: '19:00', time2: '01:00', venue: 'Shelter Pererenan', btn: 'tickets', url: SHELTER_BOOK }
        ],
        gallery: ['fire', 'scallops', 'coals', 'barra', 'flatbread', 'octopus', 'pork', 'drink'].map((n, i) => ({ id: 'pg' + i, img: sh(n), venue: i === 2 ? 'Shelter Uluwatu' : 'Shelter Pererenan' })),
        places: {
          'shelter pererenan': { img: sh('fire'), area: 'Pererenan', ig: 'shelter.pererenan', menus: [
            { name: 'Lunch', url: 'https://www.shelterbali.com/lunch-menu' }, { name: 'Dinner', url: 'https://www.shelterbali.com/dinner-menu' }, { name: 'Drinks', url: 'https://www.shelterbali.com/drink-menu' }] },
          'shelter uluwatu': { img: sh('coals'), area: 'Coming soon' }
        }
      };
    }
  }
};

const TRANS_BOOK = 'https://reservations.transresortbali.com/book/dates-of-stay';
const tr = n => '/demo-guest/p-trans-' + n + '.jpg';
P.trans = {
  brand: 'The Trans Resort Bali', logo: '/demo-guest/p-trans-logo.png', first: 'Alexander', tier: 'vip', visits: 6, since: 2025, favourite: 'The 18th',
  perks: ['Welcome drink at The 18th Rooftop', 'Late check-out until 2pm, when available', '15% off at the spa', 'Free kids club afternoons'],
  perkIcons: ['cocktail', 'key', 'leaf', 'smile'],
  reward: { target: 10, text: 'One night in a pool villa' },
  venues: ['The 18th Rooftop Bar', 'The Restaurant', 'The Lobby Lounge'].map(name => ({ name, area: 'Seminyak', map: 'https://www.google.com/maps/dir/?api=1&destination=The+Trans+Resort+Bali&destination_place_id=ChIJSdIXcT1H0i0R0vTqmwjznss', review: 'https://search.google.com/local/writereview?placeid=ChIJSdIXcT1H0i0R0vTqmwjznss' })),
  // Bottom bar: Book = rooms + each outlet (no outlet booking details yet, so they all call reception); Contact = the hotel
  stay: TRANS_BOOK,
  contact: { phone: '+62 361 898 1234', wa: '6281138201212', email: 'reservation.bali@thetranshotel.com', map: 'https://www.google.com/maps/dir/?api=1&destination=The+Trans+Resort+Bali&destination_place_id=ChIJSdIXcT1H0i0R0vTqmwjznss', ig: 'thetransresortbali' },
  acts: [
    { title: 'Sunset at The 18th', line: 'Live acoustic on the rooftop', every: [4, 5, 6], start: '17:30', end: '20:30', venue: 'The 18th Rooftop Bar' },
    { title: 'Afternoon tea', line: 'Cakes, scones and Balinese treats', every: [5, 6, 0], start: '15:00', end: '17:00', venue: 'The Lobby Lounge' },
    { title: 'Live piano in the lobby', line: 'Easy evening music with a nightcap', every: [1, 2, 3, 4], start: '19:00', end: '21:00', venue: 'The Lobby Lounge' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#7A1F1F', acc: '#B8923A', pg: '#F7F3EC' }, motion: true, video: '/demo-guest/p-trans-film.mp4',
      slides: [
        { id: 'ts1', img: tr('pool'), title: 'The lagoon pool', line: 'Swim-up bar as the sun goes down', venue: '', btn: 'book', url: TRANS_BOOK },
        { id: 'ts2', img: tr('rooftop'), title: 'Sunsets at The 18th', line: 'Rooftop cocktails over Seminyak', venue: 'The 18th Rooftop Bar' },
        { id: 'ts9', img: tr('18couple'), title: 'Sunset dinner for two', line: 'A private table on the rooftop', venue: 'The 18th Rooftop Bar', btn: 'wa' },
        { id: 'ts3', img: tr('villa'), title: 'Private pool villas', line: 'Wake up steps from your own pool', venue: '', btn: 'book', url: TRANS_BOOK },
        { id: 'ts4', img: tr('restoroom'), title: 'The Restaurant', line: 'Breakfast to dinner, by the pool', venue: 'The Restaurant' },
        { id: 'ts7', img: tr('lobster'), title: 'Lobster thermidor', line: 'Baked with cheese, garlic rice', venue: 'The Restaurant' },
        { id: 'ts8', img: tr('llcocktails'), title: 'Cocktails in the lobby', line: 'Shaken at the bar, served to you', venue: 'The Lobby Lounge' },
        { id: 'ts5', img: tr('spa'), title: 'The spa', line: 'Balinese treatments, members 15% off', venue: '' },
        { id: 'ts6', img: tr('balcony'), title: 'Suites with a view', line: 'Your own bath on the balcony', venue: '', btn: 'book', url: TRANS_BOOK }
      ],
      deals: [
        { id: 'td1', img: tr('rooftop'), title: 'Sunset hour · 2 for 1 cocktails', when: 'Daily · 5–7pm', venue: 'The 18th Rooftop Bar' },
        { id: 'td2', img: tr('llcoffee'), title: 'Afternoon tea for two', when: 'Daily · 3–5pm', venue: 'The Lobby Lounge' },
        { id: 'td3', img: tr('benedict'), title: 'Sunday brunch · kids eat free', when: 'Sundays · 11am–3pm', venue: 'The Restaurant' },
        { id: 'td6', img: tr('llmartini'), title: 'Lychee martini · cocktail of the month', when: 'Daily · from 4pm', venue: 'The Lobby Lounge' },
        { id: 'td4', img: tr('surfturf'), title: 'Surf & turf for two · Rp 650k', when: 'Every night · 6–10pm', venue: 'The Restaurant' },
        { id: 'td5', img: tr('oxtail'), title: 'Sop buntut · Thursday special', when: 'Thursdays · lunch', venue: 'The Restaurant' }
      ],
      events: [
        { id: 'te1', img: tr('ballroom'), title: 'Christmas Eve gala dinner', line: 'Live band and a festive buffet', date: y + '-12-24', time: '19:00', time2: '23:00', venue: 'The Restaurant', btn: 'call', hl: true,
          details: 'A festive buffet in The Restaurant with a live band, carols and Santa for the kids.', dress: 'Smart casual' },
        { id: 'te2', img: tr('rooftop'), title: "New Year's Eve at The 18th", line: 'Fireworks over Seminyak', date: y + '-12-31', time: '20:00', time2: '01:00', venue: 'The 18th Rooftop Bar', btn: 'wa',
          blast: "✨ NEW YEAR'S EVE AT THE 18TH ✨\n\nSay goodbye to " + y + " on the highest rooftop in Seminyak 🥂\n\n📅 Thursday 31 December\n⏰ 8pm till 1am\n📍 The 18th Rooftop Bar, The Trans Resort Bali\n\n🎧 DJ sets all night, live sax at sunset\n🎆 Midnight fireworks over the skyline\n🍾 Free-flow packages from Rp 1.5m\n🍽️ Canapés served from 9pm\n\n👗 Dress code: glam, gold and sparkle\n🔞 18+ only\n\nSpaces are limited, so book early!\nWhatsApp us to reserve your table 💬" },
        { id: 'te3', img: tr('wedding'), title: 'Wedding showcase', line: 'Meet our wedding team', date: addDays(today, 10), time: '10:00', time2: '15:00', venue: 'The Lobby Lounge', btn: 'email' }
      ],
      gallery: ['pool', 'beach', 'rooftop', '18lounge', '18couple', '18day', '18sunset', 'llroom', 'llcocktails', 'llwelcome', 'llcoffee', 'llmartini', 'llmojito', 'courtyard', 'restoroom', 'lobster', 'steak', 'salmon', 'surfturf', 'chicken', 'oxtail', 'benedict', 'villapool', 'villa', 'room', 'balcony', 'spa', 'lobby', 'lounge', 'dining', 'kids', 'ballroom', 'entrance'].map((n, i) => ({ id: 'tg' + i, img: tr(n), venue: n === 'rooftop' || n === '18lounge' || n === '18couple' || n === '18day' || n === '18sunset' ? 'The 18th Rooftop Bar' : ['dining', 'restoroom', 'lobster', 'steak', 'salmon', 'surfturf', 'chicken', 'oxtail', 'benedict'].includes(n) ? 'The Restaurant' : ['lobby', 'lounge', 'llroom', 'llcocktails', 'llwelcome', 'llcoffee', 'llmartini', 'llmojito'].includes(n) ? 'The Lobby Lounge' : '' })),
      places: {
        'the 18th rooftop bar': { img: tr('18lounge'), area: 'Rooftop · sunset views', ig: 'thetransresortbali' },
        'the restaurant': { img: tr('restoroom'), area: 'All-day dining by the pool', ig: 'thetransresortbali' },
        'the lobby lounge': { img: tr('llroom'), area: 'Coffee, tea and cocktails', ig: 'thetransresortbali' }
      }
    };
  }
};

const CODES = { S8HLTR: 'shelter', T7RNSB: 'trans', '5NKGZJ': 'trans' };   // 5NKGZJ = the printed sample card, shown as Trans for the GM demo
module.exports = { get: code => P[CODES[code]] || null, nextDow };
