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
    brand: 'Shelter', logo: '/demo-guest/p-shelter-logo.png', first: 'Stephen', tier: 'member', visits: 12, since: 2024, favourite: 'Shelter Pererenan',
    perks: ['Glass of house wine with every dinner', 'First pick of tables for Shelter Sessions', 'Birthday dessert from the fire', 'Skip the wait for Sunday BBQ'],
    perkIcons: ['glass', 'ticket', 'cake', 'star'],
    reward: { target: 15, text: "Chef's fire menu for two" },
    venues: [
      { name: 'Shelter Pererenan', area: 'Pererenan', opens: '12:00', closes: '00:00', map: 'https://maps.app.goo.gl/Z9h6Ns2VTGCUGSeH7', wa: '6282340040199', phone: '+62 823 4004 0199', email: 'info@shelterbali.com', review: 'https://maps.app.goo.gl/Z9h6Ns2VTGCUGSeH7' },
      { name: 'Shelter Uluwatu', area: 'Uluwatu', email: 'info@shelterbali.com' },
      { name: 'NALU Gelato', area: 'Jl. Pantai Batu Bolong, Canggu', opens: '11:00', closes: '00:00', wa: '6281239333893' }   // NALU: from nalugelato.com
    ],
    acts: [
      { title: 'Sunday BBQ', line: 'Whole fish and meats over the fire', every: [0], start: '12:00', end: '17:00', venue: 'Shelter Pererenan' },
      { title: 'Fireside acoustic', line: 'Live music by the fire pit', every: [3, 5, 6], start: '19:00', end: '22:00', venue: 'Shelter Pererenan' }
    ],
    content: today => {
      const y = year(today);
      return {
        theme: { top: '#141414', acc: '#CDA86B', dark: true }, video: '/demo-guest/p-shelter-film-v2.mp4', videoTall: true,
        slides: [
          { id: 'ps0', img: sh('entrance'), title: 'Welcome back to Shelter', line: 'Your table under the trees', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps1', img: sh('longtable'), title: 'Shelter Sessions', line: 'Long tables, one night, one fire', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps2', img: sh('flame'), title: 'Wood roasted moon scallops', line: 'Lemon butter, chilli salt', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps3', img: sh('cocktails'), title: 'Sundowners from 5pm', line: 'Mezcal, agave and fresh fruit', venue: 'Shelter Pererenan' },
          { id: 'ps4', img: sh('party'), title: 'Celebrate with us', line: 'Birthdays, big nights, the whole crew', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps5', img: sh('coals'), title: 'Charred over coals, by hand', line: 'Coming soon to Uluwatu', venue: 'Shelter Uluwatu' },
          { id: 'ps6', img: '/demo-guest/p-nalu-cone.jpg', title: 'Dessert at NALU', line: 'Artisan gelato, made fresh daily in Canggu', venue: 'NALU Gelato', btn: 'wa' }
        ],
        deals: [
          { id: 'pd1', img: sh('cocktails'), title: 'Mezcal hour · 2 for 1 Sinaloa', when: 'Daily · 5–7pm', venue: 'Shelter Pererenan' },
          { id: 'pd2', img: sh('salmon'), title: 'Long lunch · 3 courses Rp 395k', when: 'Mon–Fri · 12–3pm', venue: 'Shelter Pererenan' },
          { id: 'pd3', img: sh('pig'), title: 'Sunday BBQ · sharing feast', when: 'Sundays · from 12pm', venue: 'Shelter Pererenan' },
          { id: 'pd4', img: sh('table'), title: 'Book the long table · 10+ guests', when: 'Any night · ask us', venue: 'Shelter Pererenan' },
          { id: 'pd5', img: '/demo-guest/p-nalu-affogato.jpg', title: 'Members: a free scoop with any affogato', when: 'Daily · 2–5pm', venue: 'NALU Gelato' }
        ],
        events: [
          { id: 'pe1', img: sh('longtable'), title: 'Shelter Sessions Vol. 12', line: 'Guest chef, one night only', date: addDays(today, 9), time: '18:00', time2: '23:00', venue: 'Shelter Pererenan', btn: 'tickets', url: SHELTER_BOOK, hl: true,
            details: 'A guest chef joins the Shelter team at the fire for one night - a set menu cooked over wood, with paired drinks.', price: 'Set menu, paired drinks available', notes: 'Members get first pick of tables.' },
          { id: 'pe2', img: sh('grill'), title: 'Bonfire Sessions', line: 'Fireside night with Charlie Pretet', date: addDays(today, 4), time: '19:00', time2: '23:00', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK,
            details: 'Live music around the fire pit, wood-fired sharing plates and the bar open late.' },
          { id: 'pe3', img: sh('octopus'), title: 'Christmas by the fire', line: 'Long table lunch, cooked over wood', date: y + '-12-25', time: '12:00', time2: '17:00', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK,
            details: 'A Christmas long lunch from the fire - whole roasted fish, slow cooked meats and all the sides.' },
          { id: 'pe4', img: sh('party'), title: "New Year's Eve", line: 'Fire, feasting and a late bar', date: y + '-12-31', time: '19:00', time2: '01:00', venue: 'Shelter Pererenan', btn: 'tickets', url: SHELTER_BOOK }
        ],
        gallery: ['entrance', 'longtable', 'flame', 'room', 'bread', 'cocktails', 'grill', 'salmon', 'kitchen', 'octo', 'party', 'kofta', 'pig', 'table', 'chef', 'fire', 'scallops', 'barra', 'flatbread', 'octopus', 'pork', 'drink', 'coals'].map((n, i) => ({ id: 'pg' + i, img: sh(n), venue: n === 'coals' ? 'Shelter Uluwatu' : 'Shelter Pererenan' }))
          .concat(['cone', 'front', 'choc', 'cup', 'affogato', 'shop', 'caramel', 'bag', 'red'].map((n, i) => ({ id: 'png' + i, img: '/demo-guest/p-nalu-' + n + '.jpg', venue: 'NALU Gelato' }))),
        gift: { on: true, title: 'A night at Shelter', line: 'Give someone a seat by the fire. Tell us the amount and who it is for.', to: '6282340040199', amounts: [500000, 1000000, 2000000], max: 5000000 },
        places: {
          'shelter pererenan': { img: sh('room'), area: 'Pererenan', ig: 'shelter.pererenan', menus: [
            { name: 'Lunch', pages: [{ img: '/demo-guest/p-shelter-menu-lunch-1.jpg' }, { img: '/demo-guest/p-shelter-menu-lunch-mains.jpg' }, { img: '/demo-guest/p-shelter-menu-lunch-2.jpg' }] }, { name: 'Dinner', pages: [{ img: '/demo-guest/p-shelter-menu-dinner-1.jpg' }, { img: '/demo-guest/p-shelter-menu-dinner-2.jpg' }, { img: '/demo-guest/p-shelter-menu-dinner-dessert.jpg' }] }, { name: 'Drinks', url: 'https://www.shelterbali.com/drink-menu' }] },
          'shelter uluwatu': { img: sh('coals'), area: 'Uluwatu', soon: true },
          'nalu gelato': { img: '/demo-guest/p-nalu-front.jpg', area: 'Gelato · Canggu', ig: 'nalu_gelato', other: true, menus: [{ name: 'Gelato & coffee', pages: [{ img: '/demo-guest/p-nalu-menu.jpg' }] }] }   // menu retyped from the board in the shop
        }
      };
    }
  }
};

const TRANS_BOOK = 'https://reservations.transresortbali.com/book/dates-of-stay';
const tr = n => '/demo-guest/p-trans-' + n + '.jpg';
P.trans = {
  club: [{ key: 'shelter', since: 'Mar 2025', visits: 3 }],
   // Mavis Club network demo: the other venues this guest belongs to (shown only when switched on)
  guide: 'trans',   // its guest guide (/g/trans): Hotel guide button on the member page
  brand: 'The Trans Resort Bali', logo: '/demo-guest/p-trans-logo.png', icon: '/demo-guest/p-trans-icon', first: 'Alexander', tier: 'member', visits: 6, since: 2025, favourite: 'The 18th',   // icon: home-screen app icon (-192.png and -512.png)
  perks: ['Welcome drink at The 18th Rooftop', 'Late check-out until 2pm, when available', '15% off at the spa', 'Free kids club afternoons'],
  perkIcons: ['cocktail', 'key', 'leaf', 'smile'],
  reward: { target: 10, text: 'One night in a pool villa' },
  venues: ['The 18th Rooftop Bar', 'The Restaurant', 'The Lobby Lounge'].map(name => ({ name, ...({ 'The 18th Rooftop Bar': { opens: '17:00', closes: '23:00' }, 'The Restaurant': { opens: '06:30', closes: '23:00' }, 'The Lobby Lounge': { opens: '11:00', closes: '19:00' } }[name] || {}), area: 'Seminyak', map: 'https://www.google.com/maps/dir/?api=1&destination=The+Trans+Resort+Bali&destination_place_id=ChIJSdIXcT1H0i0R0vTqmwjznss', review: 'https://search.google.com/local/writereview?placeid=ChIJSdIXcT1H0i0R0vTqmwjznss' })).concat([{ name: 'The Trans Luxury Hotel Surabaya', area: 'Surabaya', map: 'https://www.google.com/maps/search/?api=1&query=The+Trans+Luxury+Hotel+Surabaya+Jl+Ahmad+Yani+260' }]),
  // Bottom bar: Book = rooms + each outlet (no outlet booking details yet, so they all call reception); Contact = the hotel
  stay: TRANS_BOOK,
  contact: { phone: '+62 361 898 1234', wa: '6281138201212', email: 'reservation.bali@thetranshotel.com', map: 'https://www.google.com/maps/dir/?api=1&destination=The+Trans+Resort+Bali&destination_place_id=ChIJSdIXcT1H0i0R0vTqmwjznss', ig: 'thetransresortbali' },
  acts: [
    { title: 'Sunset at The 18th', line: 'Live acoustic on the rooftop', every: [4, 5, 6], start: '17:30', end: '20:30', venue: 'The 18th Rooftop Bar' },
    { title: 'Afternoon tea', line: 'Cakes, scones and Balinese treats', every: [5, 6, 0], start: '15:00', end: '17:00', venue: 'The Lobby Lounge' },
    { title: 'Live piano in the lobby', line: 'Easy music before dinner', every: [1, 2, 3, 4], start: '17:00', end: '19:00', venue: 'The Lobby Lounge' }
  ],
  content: today => {
    const y = year(today);
    return { placesTitle: 'Explore Trans Resort',   // short form: the full name is too long for one line
      others: { title: 'Our other hotels' },   // template: Our other venues, heading renamed; the sister hotel is a place ticked 'Show under Our other venues' with a badge and its own app
      theme: { top: '#7A1F1F', acc: '#B8923A', pg: '#F7F3EC' }, motion: true, video: '/demo-guest/p-trans-film.mp4',
      slides: [
        { id: 'ts0', img: tr('nye'), title: "New Year's Eve " + y, line: '', venue: 'The 18th Rooftop Bar', ev: 'te2' },
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
        { id: 'te1', img: tr('ballroom'), title: 'Christmas Eve gala dinner', line: 'Live band and a festive buffet', date: y + '-12-24', time: '19:00', time2: '23:00', venue: 'The Restaurant', btn: 'call', disc: 10, hl: true,
          details: 'A festive buffet in The Restaurant with a live band, carols and Santa for the kids.', dress: 'Smart casual' },
        { id: 'te2', img: tr('nye'), title: "New Year's Eve at The 18th", line: 'Fireworks over Seminyak', date: y + '-12-31', time: '20:00', time2: '01:00', venue: 'The 18th Rooftop Bar', btn: 'wa', disc: 15,
          blast: "✨ NEW YEAR'S EVE AT THE 18TH ✨\n\nSay goodbye to " + y + " on the highest rooftop in Seminyak 🥂\n\n📅 Thursday 31 December\n⏰ 8pm till 1am\n📍 The 18th Rooftop Bar, The Trans Resort Bali\n\n🎧 DJ sets all night, live sax at sunset\n🎆 Midnight fireworks over the skyline\n🍾 Free-flow packages from Rp 1.5m\n🍽️ Canapés served from 9pm\n\n👗 Dress code: glam, gold and sparkle\n🔞 18+ only\n\nSpaces are limited, so book early!\nWhatsApp us to reserve your table 💬" },
        { id: 'te3', img: tr('wedding'), title: 'Wedding showcase', line: 'Meet our wedding team', date: addDays(today, 10), time: '11:00', time2: '15:00', venue: 'The Lobby Lounge', btn: 'email' }
      ],
      gallery: ['pool', 'beach', 'rooftop', '18lounge', '18couple', '18day', '18sunset', 'llroom', 'llcocktails', 'llwelcome', 'llcoffee', 'llmartini', 'llmojito', 'courtyard', 'restoroom', 'lobster', 'steak', 'salmon', 'surfturf', 'chicken', 'oxtail', 'benedict', 'villapool', 'villa', 'room', 'balcony', 'spa', 'lobby', 'lounge', 'dining', 'kids', 'ballroom', 'entrance'].map((n, i) => ({ id: 'tg' + i, img: tr(n), venue: n === 'rooftop' || n === '18lounge' || n === '18couple' || n === '18day' || n === '18sunset' ? 'The 18th Rooftop Bar' : ['dining', 'restoroom', 'lobster', 'steak', 'salmon', 'surfturf', 'chicken', 'oxtail', 'benedict'].includes(n) ? 'The Restaurant' : ['lobby', 'lounge', 'llroom', 'llcocktails', 'llwelcome', 'llcoffee', 'llmartini', 'llmojito'].includes(n) ? 'The Lobby Lounge' : '' })),
      places: {
        'the trans luxury hotel surabaya': { img: '/demo-guest/p-sby-beachclub.jpg', area: '28th Sky Beach Club · Rooms', other: true, badge: 'Surabaya', app: 'T6RSBY' },
        'the 18th rooftop bar': { img: tr('18lounge'), area: 'Rooftop · sunset views', ig: 'thetransresortbali', menus: [{ name: 'Food & drinks', pages: [{ img: '/demo-guest/p-trans-18th-menu-01.jpg' }, { img: '/demo-guest/p-trans-18th-menu-02.jpg' }, { img: '/demo-guest/p-trans-18th-menu-03.jpg' }, { img: '/demo-guest/p-trans-18th-menu-04.jpg' }, { img: '/demo-guest/p-trans-18th-menu-05.jpg' }, { img: '/demo-guest/p-trans-18th-menu-06.jpg' }, { img: '/demo-guest/p-trans-18th-menu-07.jpg' }, { img: '/demo-guest/p-trans-18th-menu-08.jpg' }, { img: '/demo-guest/p-trans-18th-menu-09.jpg' }, { img: '/demo-guest/p-trans-18th-menu-10.jpg' }] }] },
        'the restaurant': { img: tr('restoroom'), area: 'All-day dining by the pool', ig: 'thetransresortbali', menus: [{ name: 'Food & drinks', pages: [{ img: '/demo-guest/p-trans-restaurant-menu-1.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-2.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-3.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-4.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-5.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-6.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-7.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-8.jpg' }] }] },
        'the lobby lounge': { img: tr('llroom'), area: 'Coffee, tea and cocktails', ig: 'thetransresortbali', menus: [{ name: 'Food & drinks', pages: [{ img: '/demo-guest/p-trans-lounge-menu-1.jpg' }, { img: '/demo-guest/p-trans-lounge-menu-2.jpg' }, { img: '/demo-guest/p-trans-lounge-menu-3.jpg' }, { img: '/demo-guest/p-trans-lounge-menu-4.jpg' }] }] }
      }
    };
  }
};

// The Trans Luxury Hotel Surabaya - the same group shown the other way round: Surabaya is the app, Trans Bali is "Our other hotel"
// (so on the Zoom with Alex we can show both ways). Facts from transhotelgroup.com + the Aug 2026 opening press; hours where known.
const sb2 = n => '/demo-guest/p-sby-' + n + '.jpg';
const SBY_BOOK = 'https://www.transhotelgroup.com/hotel_overview/45';
const SBY_FESTIVE = 'https://online.fliphtml5.com/TLHSurabaya/FESTIVE-TLHS---THE-SEASON-REIMAGINED/';
const SBY_MAP = 'https://www.google.com/maps/search/?api=1&query=The+Trans+Luxury+Hotel+Surabaya+Jl+Ahmad+Yani+260';
const sb3 = n => '/demo-guest/p-sby2-' + n + '.jpg';   // the hotel's own Instagram photos (19 Nov)
const sb4 = n => '/demo-guest/p-sby3-' + n + '.jpg';   // photos from the hotel's website (19 Nov)
P.transsby = {
  brand: 'The Trans Luxury Hotel Surabaya', logo: '/demo-guest/p-sby-logo-w.png', icon: '/demo-guest/p-sby-icon', first: 'Alexander', tier: 'member', visits: 6, since: 2025, favourite: '28th Sky Beach Club',
  perks: ['Welcome drink at the 28th Sky Beach Club', 'Late check-out until 2pm, when available', '15% off at the spa', 'Free Kids Club afternoons'],
  perkIcons: ['cocktail', 'key', 'leaf', 'smile'],
  reward: { target: 10, text: 'One night in the Celebrity Suite' },
  venues: ['28th Sky Beach Club', 'The 27th Sky Lounge & Bistro', 'Grand Restaurant', 'The Lounge', 'The Spa', 'Wet Relaxation Areas', 'Fitness & Movement Zone', 'Beauty Salon', 'Kids Club'].map(name => ({ name, ...({ '28th Sky Beach Club': { opens: '12:00', closes: '00:00' }, 'The 27th Sky Lounge & Bistro': { opens: '12:00', closes: '00:00' }, 'The Spa': { opens: '10:00', closes: '22:00' }, 'Wet Relaxation Areas': { opens: '06:00', closes: '22:00' }, 'Fitness & Movement Zone': { opens: '06:00', closes: '22:00' }, 'Beauty Salon': { opens: '10:00', closes: '22:00' }, 'Kids Club': { opens: '08:00', closes: '20:00' } }[name] || {}), area: 'Surabaya', map: SBY_MAP })).concat([{ name: 'The Trans Resort Bali', area: 'Bali', map: 'https://www.google.com/maps/dir/?api=1&destination=The+Trans+Resort+Bali&destination_place_id=ChIJSdIXcT1H0i0R0vTqmwjznss' }]),
  stay: SBY_BOOK,
  contact: { phone: '+62 811 1888 8055', wa: '6281118888055', map: SBY_MAP, ig: 'transluxurysurabaya' },
  acts: [
    { title: 'Afternoon tea', line: 'Sweet and savoury tiers, daily', every: [1, 2, 3, 4, 5, 6, 0], start: '15:00', end: '17:00', venue: 'The Lounge' },
    { title: 'Golden hour at the 28th', line: 'Sunset by the infinity pool', every: [1, 2, 3, 4, 5, 6, 0], start: '17:00', end: '19:00', venue: '28th Sky Beach Club' },
    { title: 'Dinner over the city', line: 'Western menu, 27 floors up', every: [4, 5, 6], start: '18:00', end: '22:00', venue: 'The 27th Sky Lounge & Bistro' }
  ],
  content: today => {
    const y = year(today);
    return { placesTitle: 'Explore The Trans Surabaya',
      others: { title: 'Our other hotels' },   // template: Our other venues, heading renamed; the sister hotel is a place ticked 'Show under Our other venues' with a badge and its own app
      theme: { top: '#1C1C1E', acc: '#C9A96E', pg: '#ECE9E4' }, motion: true, video: '/demo-guest/p-sby-film.mp4',   // clean white with their gold (Robbie 19 Nov: not the heavy dark look)
      slides: [],   // Robbie 19 Nov: this hotel is event-led, so the Highlights are all events (each with See more)
      deals: [   // afternoon tea is already in What's on; stays and dinners are Highlights - nothing repeated
        { id: 'sd1', img: sb3('gift-lunch'), title: 'Christmas Gift Exchange Lunch', when: 'Buy 1 get 1 free · 1–30 Dec', venue: 'Grand Restaurant' },
        { id: 'sd2', img: sb3('hampers'), title: 'Festive hampers · 20% off until 10 Dec', when: 'From IDR 688,000++', venue: 'The Lounge' },
        { id: 'sd3', img: sb3('takehome'), title: 'A Feast to Take Home', when: 'From IDR 388,000++', venue: 'Grand Restaurant' }
      ],
      events: [
        { id: 'se1', img: sb3('suite-sunset'), title: 'The Season Reimagined', line: 'See the full festive programme', date: y + '-12-24', time: '18:00', time2: '23:00', venue: '', btn: 'book', url: SBY_FESTIVE, hl: true,
          details: 'Christmas and New Year at The Trans Luxury Hotel Surabaya. Tap Book now to see the full festive programme.' },
        { id: 'se2', img: sb3('xmas-family'), title: 'Christmas Above the City', line: 'A festive family getaway, with Christmas Eve dinner 27 floors up', date: y + '-12-24', venue: '', btn: 'book', url: SBY_BOOK, hl: true, price: 'Early bird from IDR 2,718,000++ a night',
          details: 'Stay 24 to 26 December. One night in an Executive Room, Christmas Eve dinner at the Sky Beach Club 27th level for 2 adults and 2 children, breakfast, Kids Club and the infinity pool. Book by 11 December.' },
        { id: 'se3', img: sb3('holiday'), title: 'The Holiday Stay', line: 'A festive stay with the Christmas Eve buffet at Grand Restaurant', date: y + '-12-24', venue: '', btn: 'book', url: SBY_BOOK, hl: true, price: 'Early bird from IDR 1,898,000++ a night',
          details: 'Stay 24 to 26 December. One night in a Premier Room, Christmas Eve dinner buffet for 2, breakfast, Kids Club, fitness centre and the infinity pool. Book by 11 December.' },
        { id: 'se4', img: sb3('newyear'), title: 'New Year Stay', line: 'Welcome 2027 with a night above the city', date: y + '-12-31', venue: '', btn: 'book', url: SBY_BOOK, hl: true, price: 'Early bird from IDR 2,718,000++ a night',
          details: "Stay 31 December to 1 January. One night in a Premier Room, New Year's Eve dinner at Grand Restaurant for 2, breakfast, Kids Club and the infinity pool. Book by 11 December." },
        { id: 'se5', img: sb3('fireworks'), title: 'Fireworks Party & BBQ Dinner', line: 'Count down to midnight with DJ Katty Butterfly', date: y + '-12-31', time: '20:00', time2: '01:00', venue: '28th Sky Beach Club', btn: 'book', url: SBY_FESTIVE, hl: true, price: 'IDR 999,000++ per person',
          details: 'Barbecue dinner by the infinity pool on the 28th level, fireworks over the city at midnight, and DJ Katty Butterfly until 1am.' },
        { id: 'se6', img: sb3('xmas-sky'), title: 'Christmas Dinner at the Sky Beach Club', line: 'Indoors on the 27th level', date: y + '-12-25', time: '18:00', venue: '28th Sky Beach Club', btn: 'book', url: SBY_FESTIVE, price: 'From IDR 488,000++ per person',
          details: 'Christmas dinner indoors on the 27th level, from 6pm, with the city lights below.' },
        { id: 'se7', img: sb3('xmas-grand'), title: 'Christmas Dinner & Brunch', line: 'Christmas Eve dinner, Christmas Day brunch and dinner', date: y + '-12-24', time: '18:00', time2: '21:00', venue: 'Grand Restaurant', btn: 'book', url: SBY_FESTIVE, hl: true, price: 'IDR 588,000++ per person',
          details: 'Christmas Eve dinner 6 to 9pm. Christmas Day brunch 12 to 3pm and dinner 6 to 9pm. Early bird 30% off until 10 December.' },
        { id: 'se8', img: sb3('nye-table'), title: "The New Year's Table", line: 'Dinner and countdown at Grand Restaurant', date: y + '-12-31', time: '19:00', time2: '00:00', venue: 'Grand Restaurant', btn: 'book', url: SBY_FESTIVE, hl: true, price: 'IDR 628,000++ per person',
          details: "New Year's Eve buffet, seafood, carvery and desserts, then the countdown to midnight. 20% off when you book by 30 November." },
        { id: 'so1', img: sb4('snowy'), title: 'Snowy Family Escape', line: 'Breakfast, Kids Club and Trans Snow World', venue: '', btn: 'book', url: SBY_BOOK, hl: true,
          details: 'A family stay with breakfast at Grand Restaurant, fun access to the Kids Club and Trans Snow World, the indoor snow park one minute away.' },
        { id: 'so2', img: sb4('executive'), title: 'The Executive Experience', line: 'Breakfast, laundry, massage and the Sky Beach Club', venue: '', btn: 'book', url: SBY_BOOK, hl: true,
          details: 'For business stays: breakfast at Grand Restaurant, laundry, a massage and the Sky Beach Club experience.' },
        { id: 'so3', img: sb4('weekend'), title: 'Weekend Best Deal', line: 'Breakfast, Kids Club and the Sky Beach Club', venue: '', btn: 'book', url: SBY_BOOK, hl: true,
          details: 'Weekend stays with breakfast at Grand Restaurant, fun access to the Kids Club and the Sky Beach Club experience.' },
        { id: 'so4', img: sb4('business'), title: 'Best Value Business Stay', line: 'Work above the city', venue: '', btn: 'book', url: SBY_BOOK, hl: true, price: 'From IDR 1,050,000++ a night',
          details: 'A great-value room for business travellers, minutes from Trans Icon Mall. Book with the promo code applied automatically.' }
      ],
      gallery: [   // the hotel's best ~40, each tagged to its place; untagged = the hotel itself (rooms, ballrooms, weddings)
        ...[['pool-day', '28th Sky Beach Club'], ['cocktail-sunset', '28th Sky Beach Club'], ['dive', '28th Sky Beach Club'], ['umbrella', '28th Sky Beach Club'],
          ['tea-close', 'The Lounge'], ['coffee', 'The Lounge'], ['hightea', 'The Lounge'],
          ['chinese-fish', 'Grand Restaurant'], ['indo-dishes', 'Grand Restaurant'], ['grand-resto', 'Grand Restaurant'], ['resto-window', ''],
          ['suite-sunset', ''], ['room-view', ''], ['inroom-view', ''], ['amenities', ''], ['wedding-flower', ''], ['wedding-aisle', ''], ['ballroom', '']].map(([n, v]) => ({ img: sb3(n), venue: v })),
        ...[['pool-cabanas', '28th Sky Beach Club'], ['lounge', 'The Lounge'], ['lounge-stair', 'The Lounge'], ['lounge-bar', 'The Lounge'], ['grand-chandelier', 'Grand Restaurant'],
          ['spa', 'The Spa'], ['wet', 'Wet Relaxation Areas'], ['gym', 'Fitness & Movement Zone'], ['salon', 'Beauty Salon'], ['kids', 'Kids Club'],
          ['room-king', ''], ['room-view2', ''], ['suite-living', ''], ['suite-view', ''], ['suite-dining', ''], ['bath-marble', ''],
          ['ballroom-wedding', ''], ['iconic-ballroom', ''], ['boardroom', '']].map(([n, v]) => ({ img: sb4(n), venue: v })),
        { img: sb2('skylounge'), venue: 'The 27th Sky Lounge & Bistro' }
      ].map((g, i) => ({ id: 'sg' + i, ...g })),
      places: {
        'the trans resort bali': { img: tr('pool'), area: 'The 18th Rooftop · Pool villas', other: true, badge: 'Bali', app: 'T7RNSB' },
        '28th sky beach club': { img: sb3('pool-day'), area: 'Rooftop beach · infinity pool' },
        'the 27th sky lounge & bistro': { img: sb2('skylounge'), area: 'Western menu · city views' },
        'grand restaurant': { img: sb3('grand-resto'), area: 'Buffet · Asian and international' },
        'the lounge': { img: sb4('lounge'), area: 'Coffee, light bites, drinks' },
        'the spa': { img: sb4('spa'), area: "Treatments · couple's room", menus: [{ name: 'Treatments', url: 'https://online.fliphtml5.com/TLHSurabaya/The-SPA-Booklet/' }] },
        'wet relaxation areas': { img: sb4('wet'), area: 'Steam · sauna · jacuzzi' },
        'fitness & movement zone': { img: sb4('gym'), area: 'Strength · Pilates · yoga' },
        'beauty salon': { img: sb4('salon'), area: 'Hair, beauty and nails' },
        'kids club': { img: sb4('kids'), area: 'Play zone for little ones' }
      }
    };
  }
};

// Bali Padel Academy (Eric) - padel demo: same template, padel wording, big "Book a court" button to their Playtomic
const PT = 'https://playtomic.com/clubs/bali-padel-academy';
const bp = n => '/demo-guest/p-bpa-' + n + '.jpg';
const BPA_MAP = 'https://www.google.com/maps/search/?api=1&query=Bali+Padel+Academy+Canggu';
P.bpa = {
  kind: 'padel', bookTop: { url: PT, label: 'Book a court', via: 'on Playtomic' },
  // Real BPA coaches, from BPA's own "Meet our coaches" Instagram post (2024) - check with Eric who's still on the team
  coaches: [
    { name: 'Jesus Olmo', ini: 'JO', img: bp('coach-jesus'), tags: ['Head coach', 'All levels'], line: 'All levels, beginners to competitive. Loves video analysis.', book: PT,
      bio: 'Head Coach of the BPA coaching team and NOX Method ambassador, with a degree in Sciences and Technologies applied in Sports. Jesus coaches every level, from beginners to high-performance and competitive players, and loves using video analysis to help players improve.' },
    { name: 'Aleix Puchol', ini: 'AP', img: bp('coach-aleix'), tags: ['Head coach', '15 years'], line: '15 years coaching padel. Catch him competing too!', book: PT,
      bio: 'NOX Method ambassador and Head Coach of the BPA coaching team. With a degree in Sports Management and Sports Education, Aleix has been coaching padel for 15 years and has helped many players raise their game. Don\'t miss watching him compete!' },
    { name: 'Albina', ini: 'AL', img: bp('coach-albina'), tags: ['Ex-WTA pro', 'EN · RU'], line: 'Former WTA doubles player with 31 ITF titles.', book: PT,
      bio: 'A former elite tennis player, ranked WTA top 208 in doubles, with 31 ITF titles and a bronze medal from the 15th Asian Games in Doha. Fluent in Russian and English, Albina coaches the NOX method, mentored by BPA head coaches Jesus and Aleix.' },
    { name: 'Ajo', ini: 'AJ', img: bp('coach-ajo'), tags: ['Ex-badminton coach'], line: 'Makes every lesson fun. Infectious positive energy.', book: PT,
      bio: 'Once a well-known badminton coach in Indonesia, Ajo switched his focus to padel and in just two years became an accomplished player and coach. With a big smile and infectious positive energy, he makes your padel enjoyable.' },
    { name: 'Skar', ini: 'SK', img: bp('coach-skar'), tags: ['NOX advanced coach'], line: 'Former national tennis player, half Spanish.', book: PT,
      bio: 'Once a national tennis player, Skar is half Spanish and lived and played padel in Spain for some years. He is certified as an Advanced Level Padel Coach under the NOX Method and loves sharing his passion for the game.' },
    { name: 'Eduard Hernandez', ini: 'EH', img: bp('coach-eduard'), tags: ['Senior coach', 'Events'], line: 'Senior coach. Runs the academy and events.', book: PT,
      bio: 'Academy & events coordinator and senior padel coach. Eduard has over 6 years of coaching in Spain and Denmark and a track record in club management.' }
  ],
  wall: [
    { club: true, when: '2h ago', text: '👋 Welcome to our 12 new members this week: Kadek, Jonas, Priya, Lucas and 8 more. Your keyring is your key to everything here. See you on court!', clap: 41, fire: 6 },
    { club: true, when: 'Yesterday', text: '🛍️ Reminder: members get 15% off in the pro shop. New NOX rackets just landed. Show your keyring at the counter.', img: bp('nox'), clap: 33, fire: 12 },
    { club: true, when: '2 days ago', text: '🏆 Members Americana winners: congrats Sarah & Mia, unbeaten all evening! Next members night is Friday, sign up early.', img: bp('courts'), clap: 24, fire: 9 },
    { club: true, when: '3 days ago', text: '⭐ Member of the month: Wayan K. 23 games, 4 Americanas, always first to help the beginners. Your free NOX grip is at reception!', clap: 57, fire: 22 },
    { club: true, when: 'Last week', text: '🎟️ Members first: NOX Cup sign-ups open to members 48 hours before everyone else. Finals 12 December under the lights.', img: bp('events'), clap: 63, fire: 31 }
  ],
  newbie: { title: 'New to padel?', cta: "We'll find you a game", url: 'https://ig.me/m/balipadelacademy', rows: [
    { icon: 'shoe', title: 'What to wear', text: 'Sports clothes and flat court shoes. No running shoes on the courts, please.' },
    { icon: 'racket', title: 'No racket? No problem', text: 'NOX rackets to rent at reception, Rp 50k. Members free.' },
    { icon: 'levels', title: 'What does 2.5 mean?', text: 'Levels go from 0 (first time) to 7 (pro). Most beginners start around 1. Not sure? Ask a coach.' },
    { icon: 'swap', title: 'How an Americana works', text: 'Sign up alone, we mix the teams. Play short games with different partners. Great for meeting people.' }
  ] },
  brand: 'Bali Padel Academy', logo: '/demo-guest/p-bpa-logo.png', icon: '/demo-guest/p-bpa-icon', first: 'Eric', tier: 'member', visits: 7, since: 2024, favourite: 'Padel Courts',
  perks: ['Member prices at the restaurant', '15% off in the pro shop', 'Free pool access after your game', 'Kids play free in the play park'],
  perkIcons: ['food', 'tag', 'sun', 'smile'],
  reward: { target: 10, text: 'A free NOX ball tube and smoothie' },
  venues: [
    { name: 'Padel Courts', opens: '06:30', closes: '23:00', book: PT },
    { name: 'Restaurant', opens: '07:00', closes: '22:00' },
    { name: 'Pro Shop', opens: '08:00', closes: '21:00' },
    { name: 'Infinity Pool', opens: '07:00', closes: '20:00' },
    { name: 'Kids Area', opens: '08:00', closes: '19:00' },
    { name: 'Recovery Area', opens: '07:00', closes: '21:00' }
  ].map(v => Object.assign({ area: 'Canggu', map: BPA_MAP }, v)),
  contact: { map: BPA_MAP, ig: 'balipadelacademy' },
  acts: [
    { title: 'Silver Men Americana', line: '', every: [1], start: '13:00', end: '15:00', venue: 'Padel Courts' },
    { title: 'Ladies Silver Americana', line: 'Fixed teams', every: [1], start: '15:00', end: '17:00', venue: 'Padel Courts' },
    { title: 'Beginners Americana', line: '', every: [1], start: '17:00', end: '19:00', venue: 'Padel Courts' },
    { title: 'Bronze Ladies Americana', line: 'Fixed teams', every: [2], start: '12:00', end: '14:00', venue: 'Padel Courts' },
    { title: 'Bronze Men Americana', line: '', every: [2], start: '18:30', end: '21:00', venue: 'Padel Courts' },
    { title: 'Best Kebab Beginners Ladies Americana', line: '', every: [3], start: '13:00', end: '15:00', venue: 'Padel Courts' },
    { title: 'Silver Ladies Americana', line: 'Fixed teams', every: [3], start: '18:00', end: '20:00', venue: 'Padel Courts' },
    { title: 'Bronze Men Americana', line: '', every: [4], start: '12:00', end: '14:00', venue: 'Padel Courts' },
    { title: 'High Bronze Ladies Americana', line: 'Fixed teams', every: [4], start: '17:00', end: '19:00', venue: 'Padel Courts' },
    { title: 'CARE Beginners Ladies Americana', line: '', every: [5], start: '15:30', end: '17:30', venue: 'Padel Courts' },
    { title: 'Bronze Men Americana', line: 'Fixed teams', every: [5], start: '17:30', end: '20:00', venue: 'Padel Courts' },
    { title: 'High Bronze Ladies Americana', line: 'Fixed teams', every: [6], start: '12:00', end: '14:00', venue: 'Padel Courts' },
    { title: 'Silver Men Americana', line: 'Fixed teams', every: [6], start: '14:00', end: '16:00', venue: 'Padel Courts' },
    { title: 'Beginners Americana', line: '', every: [6], start: '16:00', end: '18:00', venue: 'Padel Courts' },
    { title: 'Best Kebab Bronze Ladies Americana', line: '', every: [6], start: '18:00', end: '20:00', venue: 'Padel Courts' },
    { title: 'Best Kebab Bronze Men Americana', line: '', every: [0], start: '13:30', end: '15:30', venue: 'Padel Courts' },
    { title: 'Beginners Ladies Americana', line: '', every: [0], start: '15:30', end: '17:30', venue: 'Padel Courts' },
    { title: 'Bronze Ladies Americana', line: '', every: [0], start: '17:30', end: '19:30', venue: 'Padel Courts' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#B7CBB0', acc: '#111111', pg: '#F4F6F2' }, motion: true, video: '/demo-guest/p-bpa-film-v2.mp4', videoTall: true,
      slides: [
        { id: 'bs0', img: bp('events'), title: 'NOX Cup · tournament night', line: 'Finals under the lights', venue: 'Padel Courts', ev: 'be1' },
        { id: 'bs1', img: bp('courts'), title: '7 panoramic courts', line: 'Book in one tap', venue: 'Padel Courts', btn: 'book', url: PT },
        { id: 'bs5', img: bp('lounge'), title: 'New or playing solo?', line: 'Our front desk will find you a game', venue: 'Padel Courts' },
        { id: 'bs2', img: bp('pool'), title: 'Cool down in the infinity pool', line: 'Free for members after your game', venue: 'Infinity Pool' },
        { id: 'bs3', img: bp('nox'), title: 'Powered by NOX', line: 'Try the new rackets in our pro shop', venue: 'Pro Shop' },
        { id: 'bs4', img: bp('rec-icebath'), title: 'Sauna & ice bath', line: 'Recover after your game, over the rice fields', venue: 'Recovery Area' }
      ],
      deals: [
        { id: 'bd1', img: bp('lounge'), title: 'Smoothie hour · 2 for 1', when: 'Mon - Fri · 5 - 7pm', venue: 'Restaurant' },
        { id: 'bd2', img: bp('nox'), title: 'NOX rackets · members 15% off', when: 'This week', venue: 'Pro Shop' },
        { id: 'bd3', img: bp('pool'), title: 'Kids play free while you play', when: 'Every day', venue: 'Kids Area' },
        { id: 'bd4', img: bp('rec-sauna'), title: 'Members: free sauna after any lesson', when: 'Every day', venue: 'Recovery Area' }
      ],
      events: [
        { id: 'be1', img: bp('events'), title: 'NOX Cup · December', line: 'Bali\'s biggest padel weekend', date: y + '-12-12', time: '09:00', time2: '22:00', venue: 'Padel Courts', btn: 'book', url: PT, hl: true,
          details: 'Two days of padel on all 7 courts, finals on the NOX Stadium court, DJ and food all weekend.' },
        { id: 'be2', img: bp('courts'), title: 'Members Americana night', line: 'Mixed levels · drinks after', date: addDays(today, 5), time: '18:00', time2: '21:00', venue: 'Padel Courts', btn: 'book', url: PT }
      ],
      gallery: ['building', 'courts', 'lounge', 'events', 'pool', 'nox'].map((n, i) => ({ id: 'bg' + i, img: bp(n), venue: '' }))
        .concat(['rec-view', 'rec-sauna', 'rec-icebath'].map((n, i) => ({ id: 'br' + i, img: bp(n), venue: 'Recovery Area' }))),
      places: {
        'padel courts': { img: bp('courts'), area: '7 panoramic courts · NOX Stadium', ig: 'balipadelacademy', menus: [{ name: 'Lessons & prices', pages: [{ img: '/demo-guest/p-bpa-lessons.jpg' }] }] },
        'restaurant': { img: bp('events'), area: 'All-day food, coffee and smoothies', ig: 'balipadelacademy' },
        'pro shop': { img: bp('nox'), area: 'NOX rackets, balls and gear' },
        'infinity pool': { img: bp('pool'), area: 'Swim after your game' },
        'kids area': { img: bp('building'), area: 'Kids academy · ages 5 - 14', menus: [{ name: 'Kids academy', pages: [{ img: '/demo-guest/p-bpa-lessons.jpg' }] }] },
        'recovery area': { img: bp('rec-view'), area: 'Sauna and ice bath over the rice fields' }
      }
    };
  }
};

// Sundari Wellness (Seminyak day spa) - photos and logo from their own website
const su = n => '/demo-guest/p-sun-' + n + '.jpg';
const SUN_WA = '62811365563';
P.sundari = {
  brand: 'Sundari Wellness', logo: '/demo-guest/p-sundari-logo.png', icon: '/demo-guest/p-sundari-icon', first: 'Demian', tier: 'member', visits: 4, since: 2025, favourite: 'Sundari Wellness',
  perks: ['10% off every treatment', 'A birthday ritual on us', "Members-only treatment of the month", 'First pick of your favourite therapist'],
  perkIcons: ['leaf', 'cake', 'star', 'heart'],
  reward: { target: 10, text: 'A 60-minute Balinese massage' },
  venues: [{ name: 'Sundari Wellness', area: 'Seminyak', opens: '09:00', closes: '22:00', wa: SUN_WA, phone: '+62 811 365 563', map: 'https://maps.google.com/?q=SUNDARI%20Wellness%2C%20Jalan%20Petitenget%207%2C%20Seminyak%2C%20Bali' },
    { name: 'Suenyo Eco Retreat', area: 'Pandak Gede, Tabanan', wa: '62811322332', phone: '+62 811 322 332', email: 'dream@suenyo-bali.com' },   // from suenyo-bali.com
    { name: 'Villa Navaho', area: 'Bumbak, between Canggu & Seminyak', wa: '6281238144235', phone: '+62 812 3814 4235', email: 'hello@navaho-bali.com' }   // from navaho-bali.com
  ],
  contact: { wa: SUN_WA, phone: '+62 811 365 563' },
  acts: [],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#1A120D', acc: '#C9925A', dark: true }, motion: true, oneHome: true, video: '/demo-guest/p-sun-film-v2.mp4',
      gift: { on: true, title: 'The gift of a slow afternoon', line: 'A spa voucher for someone who needs it. Tell us the amount and who it is for.', to: SUN_WA, amounts: [500000, 1000000, 2000000], max: 5000000 },
      slides: [
        { id: 'us0', venue: 'Sundari Wellness', img: su('bath'), title: 'Flower bath ritual', line: 'Warm water, petals, nowhere to be', btn: 'wa' },
        { id: 'us1', venue: 'Sundari Wellness', img: su('cave'), title: 'Your quiet place in Seminyak', line: 'Open every day, 9am to 10pm', btn: 'wa' },
        { id: 'us2', venue: 'Sundari Wellness', img: su('massage'), title: 'Balinese massage', line: 'The one everyone comes back for', btn: 'wa' },
        { id: 'us3', venue: 'Sundari Wellness', img: su('couples'), title: 'Side by side', line: 'Couples rooms, two therapists', btn: 'wa' },
        { id: 'us4', venue: 'Sundari Wellness', img: su('pods'), title: 'Start with your feet', line: 'Foot ritual in our woven pods', btn: 'wa' },
        { id: 'us5', venue: 'Sundari Wellness', img: su('shop'), title: 'Take Sundari home', line: 'Oils, robes and singing bowls in our shop' },
        { id: 'us6', img: '/demo-guest/p-suenyo-aerial.jpg', title: 'Suenyo Eco Retreat', line: 'Bamboo villas in the jungle, by the Yeh Poh River', venue: 'Suenyo Eco Retreat', btn: 'wa' },
        { id: 'us7', img: '/demo-guest/p-suenyo-windows.jpg', title: 'Disconnect to reconnect', line: 'Stay a night or two at Suenyo', venue: 'Suenyo Eco Retreat', btn: 'wa' },
        { id: 'us8', img: '/demo-guest/p-suenyo-yoga.jpg', title: 'Yoga above the jungle', line: 'Wellness and rituals at Suenyo', venue: 'Suenyo Eco Retreat', btn: 'wa' },
        { id: 'us9', img: '/demo-guest/p-suenyo-cultural.jpg', title: 'Balinese cultural workshops', line: 'Ceremonies, rituals and crafts', venue: 'Suenyo Eco Retreat', btn: 'wa' },
        { id: 'us10', img: '/demo-guest/p-suenyo-proposal.jpg', title: 'Special occasions', line: 'Proposals, birthdays, private dinners', venue: 'Suenyo Eco Retreat', btn: 'wa' },
        { id: 'un1', img: '/demo-guest/p-navaho-poolnight.jpg', title: 'Villa Navaho', line: 'A private wellness villa, entirely yours', venue: 'Villa Navaho', btn: 'wa' },
        { id: 'un2', img: '/demo-guest/p-navaho-chef.jpg', title: 'A chef in the house', line: 'Balinese dinners by the pool or on the roof', venue: 'Villa Navaho', btn: 'wa' },
        { id: 'un3', img: '/demo-guest/p-navaho-massage.jpg', title: 'Massage, without leaving', line: 'A Sundari therapist comes to the villa', venue: 'Villa Navaho', btn: 'wa' },
        { id: 'un4', img: '/demo-guest/p-navaho-sauna.jpg', title: 'Sauna and cold plunge', line: 'Heat, cold and nowhere to be', venue: 'Villa Navaho', btn: 'wa' },
        { id: 'un5', img: '/demo-guest/p-navaho-proposal.jpg', title: 'Proposals and birthdays', line: 'Tell us the date, we set the villa', venue: 'Villa Navaho', btn: 'wa' }
      ],
      deals: [
        { id: 'ud1', venue: 'Sundari Wellness', img: su('pedi'), title: 'Reflexology add-on for members', when: 'Every day · 9am–5pm', btn: 'wa' },
        { id: 'ud2', venue: 'Sundari Wellness', img: su('daybed'), title: 'Travel recovery after your flight', when: 'Every day', btn: 'wa' },
        { id: 'ud3', venue: 'Sundari Wellness', img: su('room'), title: 'Members: 90 minutes for the price of 60', when: 'Mon–Thu · before 2pm', btn: 'wa' },
        { id: 'ud4', venue: 'Sundari Wellness', img: su('hands'), title: 'Signature polish with any massage', when: 'Mon–Thu', btn: 'wa' },
        { id: 'ud5', venue: 'Suenyo Eco Retreat', img: '/demo-guest/p-suenyo-pool.jpg', title: 'Members: 15% off a stay at Suenyo', when: 'Sun–Thu nights', btn: 'wa' },
        { id: 'ud6', venue: 'Villa Navaho', img: '/demo-guest/p-navaho-bath.jpg', title: 'Members: a flower bath ritual with any 2-night stay', when: 'Any night · ask us', btn: 'wa' }
      ],
      events: [
        { id: 'ue1', venue: 'Sundari Wellness', img: su('couples'), title: 'Couples ritual week', line: 'Two therapists, one room, together', date: addDays(today, 6), time: '10:00', time2: '20:00', btn: 'wa', hl: true,
          details: 'Book a room for two and enjoy the same ritual side by side. Members book first.' },
        { id: 'ue2', venue: 'Sundari Wellness', img: su('bamboo'), title: 'Christmas gift vouchers', line: 'The gift that always fits', date: y + '-12-24', btn: 'wa',
          details: 'Treatment vouchers for friends and family, ready to send on WhatsApp.' }
      ],
      gallery: ['bath', 'cave', 'corridor', 'massage', 'pods', 'couples', 'reception', 'shop', 'room', 'daybed', 'lounge2', 'pedi', 'basins', 'couple', 'jade', 'feet', 'hands2', 'scrub', 'hero', 'lounge', 'balinese', 'bamboo', 'kaya', 'reflex', 'facial', 'hands'].map((n, i) => ({ id: 'ug' + i, img: su(n), venue: 'Sundari Wellness' }))
        .concat(['pool', 'windows', 'bed', 'aerial', 'yoga', 'hammock', 'cultural', 'roof', 'proposal', 'view', 'wellness', 'front'].map((n, i) => ({ id: 'sug' + i, img: '/demo-guest/p-suenyo-' + n + '.jpg', venue: 'Suenyo Eco Retreat' })))
        .concat(['poolnight', 'chef', 'living', 'massage', 'dining', 'sauna', 'rooftop', 'proposal', 'bedroom', 'birthday', 'bath', 'pool'].map((n, i) => ({ id: 'nvg' + i, img: '/demo-guest/p-navaho-' + n + '.jpg', venue: 'Villa Navaho' }))),
      places: { 'villa navaho': { img: '/demo-guest/p-navaho-pool.jpg', area: 'Private wellness villa · Bumbak', other: true, acc: '#A85439' }, 'suenyo eco retreat': { img: '/demo-guest/p-suenyo-pool.jpg', area: 'Eco retreat · Tabanan', other: true, acc: '#23909F', menus: [{ name: 'Food', pages: ['food-1', 'food-2'].map(n => ({ img: '/demo-guest/p-suenyo-menu-' + n + '.jpg' })) }, { name: 'Drinks', pages: [{ img: '/demo-guest/p-suenyo-menu-drinks.jpg' }] }] }, 'sundari wellness': { img: su('reception'), area: 'Seminyak', ig: 'sundari.wellness', menus: [{ name: 'Treatments', pages: [1, 2, 3, 4, 5, 6].map(n => ({ img: '/demo-guest/p-sun-menu-' + n + '.jpg' })) }] } }
    };
  }
};

// Sangsaka (modern Indonesian, Kerobokan/Seminyak) - photos from their own posts, logo from their keyring; perks, deals and dates made up for the demo
const sg = n => '/demo-guest/p-sangsaka-' + n + '.jpg';
const SNG_WA = '6281236959895';
const SNG_BOOK = 'https://bookings.nowbookit.com/?accountid=79aa53dc-431a-4591-8682-0b6f56292e92&venueid=84&theme=light&colors=hex,666,000';
const SNG_MAP = 'https://goo.gl/maps/i8R5KS3zYotp2UVZ8';
const SNG_MENU = n => ({ img: '/demo-guest/p-sangsaka-menu-' + n + '.jpg' });   // their menu from the website, made into pictures (black and gold)
P.sangsaka = {

  brand: 'Sangsaka', logo: '/demo-guest/p-sangsaka-logo.png', icon: '/demo-guest/p-sangsaka-icon', first: 'Kieran', tier: 'member', visits: 7, since: 2025, favourite: 'Sangsaka',
  perks: ['15% off your bill, every visit', 'Welcome cocktail upstairs at DI ATAS', "A chef's snack from the kitchen, on the house", 'Birthday dessert from the wood oven', 'First pick of the private dining room'],
  perkIcons: ['pct', 'cocktail', 'food', 'cake', 'star'],
  reward: { target: 10, text: "Chef's sharing menu for two" },
  venues: [
    { name: 'Sangsaka', area: 'Kerobokan', opens: '17:30', closes: '23:00', wa: SNG_WA, phone: '+62 812 3695 9895', email: 'info@sangsakabali.com', map: SNG_MAP, review: SNG_MAP, book: SNG_BOOK },
    { name: 'DI ATAS', area: 'Rooftop bar upstairs', opens: '19:00', closes: '01:00', wa: SNG_WA, phone: '+62 812 3695 9895', map: SNG_MAP },
    { name: 'Luma', area: 'Batu Bolong, Canggu', opens: '12:00', closes: '23:00', wa: '6281139414999', phone: '+62 811 3941 4999' }
  ],
  contact: { wa: SNG_WA, phone: '+62 812 3695 9895', email: 'info@sangsakabali.com', map: SNG_MAP, ig: 'sangsakabali' },
  acts: [
    { title: 'Late night at DI ATAS', line: 'Cocktails on the rooftop until 1am', every: [4, 5, 6], start: '21:00', end: '01:00', venue: 'DI ATAS', ic: 'drinks' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#141210', acc: '#CDA86B', pg: '#F5F1EA' }, motion: true, video: '/demo-guest/p-sng-film.mp4', videoTall: true,
      gift: { on: true, title: "A dinner they'll remember", line: 'A thoughtful present for someone you love. Tell us the amount and who it is for.', to: SNG_WA, amounts: [500000, 1000000, 2000000], max: 5000000 },
      slides: [
        { id: 'ss1', img: sg('diners'), title: 'Modern Indonesian, with a twist', line: 'Down a back street in Seminyak', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'ss2', img: sg('crab'), title: 'Mud crab glass noodles', line: 'From the clay pot to the table', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'ss3', img: sg('mural2'), title: 'Dinner under the Barong', line: 'Wood-fired plates to share', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'ss4', img: sg('chef'), title: 'From our kitchen to your table', line: 'Indonesian flavours, cooked our way', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'ss5', img: sg('terrace'), title: 'Dinner on the terrace', line: 'Under the lanterns, from 5:30pm', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'ss6', img: sg('room'), title: 'Tables for 2 to 50', line: 'Private dining room for up to 18', venue: 'Sangsaka', btn: 'wa' },
        { id: 'ss7', img: '/demo-guest/p-luma-room.jpg', title: 'Our sister restaurant, Luma', line: 'Mediterranean, with island flavours', venue: 'Luma', btn: 'wa' }
      ],
      deals: [
        { id: 'sd1', img: sg('bordeaux'), title: 'Members: 2 for 1 Jaffa Negroni at DI ATAS', when: 'Daily · 7–9pm', venue: 'DI ATAS' },
        { id: 'sd2', img: sg('dumpling'), title: 'Dumpling night · a free plate for the table', when: 'Tuesdays', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'sd3', img: sg('beef'), title: 'Wood-fired sharing menu · Rp 650k', when: 'Sun–Thu · from 5:30pm', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'sd4', img: sg('wine'), title: 'Members: 15% off any bottle', when: 'Every night', venue: 'Sangsaka' },
        { id: 'sd5', img: '/demo-guest/p-luma-wine.jpg', title: 'Happy hour at Luma · Aperol Spritz 70k', when: 'Daily · 4–7pm', venue: 'Luma' }
      ],
      events: [
        { id: 'se1', img: sg('anise'), title: 'Spice Route dinner', line: 'Six courses, one night only', date: addDays(today, 8), time: '18:30', time2: '23:00', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK, hl: true,
          details: 'Kieran and Yunika cook a six-course menu around the spices of the archipelago, with paired drinks.', price: 'Set menu, paired drinks available', notes: 'Members get first pick of tables.' },
        { id: 'se2', img: sg('bordeaux'), title: 'Rooftop sessions', line: 'DJ upstairs at DI ATAS', date: addDays(today, 3), time: '21:00', time2: '01:00', venue: 'DI ATAS', btn: 'wa',
          details: 'Cocktails and a DJ on the rooftop, late.' },
        { id: 'se3', img: sg('crab'), title: 'Christmas sharing feast', line: 'Long tables, wood-fired', date: y + '-12-25', time: '17:30', time2: '23:00', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'se4', img: sg('diners'), title: "New Year's Eve", line: 'Dinner downstairs, party upstairs', date: y + '-12-31', time: '18:00', time2: '01:00', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK }
      ],
      gallery: ['diners', 'crab', 'barong', 'beef', 'terrace', 'dumpling', 'chef', 'plates', 'mural', 'scallop', 'banquette', 'pork', 'team', 'egg', 'room', 'squid', 'fried', 'wine', 'table', 'bordeaux', 'anise']
        .map((n, i) => ({ id: 'sg' + i, img: sg(n), venue: n === 'bordeaux' || n === 'table' ? 'DI ATAS' : 'Sangsaka' }))
        .concat(['room', 'table', 'lamb', 'chefs', 'wine'].map((n, i) => ({ id: 'sl' + i, img: '/demo-guest/p-luma-' + n + '.jpg', venue: 'Luma' }))),
      places: {
        'sangsaka': { img: sg('mural2'), area: 'Kerobokan', ig: 'sangsakabali', menus: [{ name: 'Food', pages: ['food-1', 'food-2', 'food-3'].map(SNG_MENU) }, { name: 'Wine', pages: ['wine-1', 'wine-2', 'wine-3'].map(SNG_MENU) }] },
        'di atas': { img: sg('bordeaux'), area: 'Rooftop bar upstairs', ig: 'sangsakabali', menus: [{ name: 'Cocktails', pages: ['cocktails'].map(SNG_MENU) }, { name: 'Wine', pages: ['wine-1', 'wine-2', 'wine-3'].map(SNG_MENU) }] },
        'luma': { img: '/demo-guest/p-luma-terrace.jpg', area: 'Batu Bolong, Canggu', ig: 'luma.bali', other: true, logo: '/demo-guest/p-luma-logo.png' }
      }
    };
  }
};

const MS_BOOK = 'https://www.sevenrooms.com/explore/masonryrestaurantcanggu/reservations/create/search/';
const MS_WA = '6285792505028';
const ms = n => '/demo-guest/p-masonry-' + n + '.jpg';
const MS_MENU = n => ({ img: '/demo-guest/p-masonry-menu-canggu-' + n + '.jpg' });   // Masonry Canggu menus from masonrybali.com (Robbie's screen capture)
const MS_MENU_U = n => ({ img: '/demo-guest/p-masonry-menu-uluwatu-' + n + '.jpg' });
const BV_MENU = n => ({ img: '/demo-guest/p-barvera-menu-' + n + '.jpg' });
P.masonry = {
  brand: 'Masonry', logo: '/demo-guest/p-masonry-logo.png', icon: '/demo-guest/p-masonry-icon', first: 'Ben', tier: 'member', visits: 9, since: 2024, favourite: 'Masonry Canggu',
  perks: ['10% off your bill at every Masonry', 'A Masonry Old Fashioned on arrival', 'House charcuterie for the table, on us', 'Birthday dessert from the wood oven', 'Priority bookings at all three venues'],
  perkIcons: ['pct', 'cocktail', 'food', 'cake', 'star'],
  reward: { target: 10, text: '48-hour short rib dinner for two' },
  venues: [
    { name: 'Masonry Canggu', area: 'Batu Bolong, Canggu', opens: '12:00', closes: '00:00', wa: MS_WA, phone: '+62 857 9250 5028', book: MS_BOOK },
    { name: 'Masonry Uluwatu', area: 'Uluwatu', opens: '12:00', closes: '00:00', wa: MS_WA, phone: '+62 821 4676 5177', book: MS_BOOK },
    { name: 'Masonry Japan', area: 'Niseko, Japan' },
    { name: 'Bar Vera', area: 'Pererenan', opens: '12:00', closes: '00:00', wa: '6282342713110', phone: '+62 823 4271 3110' }
  ],
  contact: { wa: MS_WA, phone: '+62 857 9250 5028' },
  acts: [
    { title: 'Fire on the grill', line: 'Everything cooked over wood and coals', every: [0, 1, 2, 3, 4, 5, 6], start: '12:00', end: '00:00', venue: 'Masonry Canggu', ic: 'food' },
    { title: 'Sunset drinks on the terrace', line: 'Chablis and small plates as the sun goes down', every: [0, 1, 2, 3, 4, 5, 6], start: '17:00', end: '19:00', venue: 'Masonry Uluwatu', ic: 'drinks' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#141414', acc: '#CDA86B', dark: true }, video: '/demo-guest/p-masonry-film-v3.mp4', videoTall: true,
      gift: { on: true, title: 'Dinner by the fire', line: 'Give someone a night at Masonry. Tell us the amount and who it is for.', to: MS_WA, amounts: [500000, 1000000, 2000000], max: 5000000 },
      slides: [
        { id: 'ms1', img: ms('window'), title: 'Good food cooked over fire', line: 'Stiff drinks, open windows, Batu Bolong', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'ms2', img: ms('beef'), title: '48-hour slow roasted short rib', line: 'Chimichurri, roasted shallots', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'ms3', img: ms('fire'), title: 'Everything over wood and coals', line: 'Made from scratch, every day', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'ms4', img: ms('backroom'), title: 'The Backroom', line: 'Leather booths, a pool table and a late bar', venue: 'Masonry Canggu', btn: 'wa' },
        { id: 'ms5', img: ms('u-scallop'), title: 'Masonry Uluwatu', line: 'The same fire, down south', venue: 'Masonry Uluwatu', btn: 'wa' },
        { id: 'ms5b', img: ms('u-carpaccio'), title: 'Beef carpaccio, Uluwatu', line: 'Raw, bright, made for sharing', venue: 'Masonry Uluwatu', btn: 'book', url: MS_BOOK },
        { id: 'ms5c', img: ms('u-chablis'), title: 'A long wine list, down south', line: 'Chablis by the glass from 5pm', venue: 'Masonry Uluwatu', btn: 'book', url: MS_BOOK },
        { id: 'ms6', img: ms('japan'), title: 'Masonry Japan', line: 'Coming to Niseko this ski season', venue: 'Masonry Canggu' },
        { id: 'mv1', img: ms('v-room'), title: 'Bar Vera', line: 'Bistro and wine bar in Pererenan', venue: 'Bar Vera', btn: 'wa' },
        { id: 'mv2', img: ms('v-grouper'), title: 'Whole grouper in the coals', line: 'Burnt butter beurre blanc, lemon', venue: 'Bar Vera', btn: 'wa' },
        { id: 'mv3', img: ms('v-martini'), title: 'Martini all day, every day', line: 'And a long wine list', venue: 'Bar Vera', btn: 'wa' }
      ],
      deals: [
        { id: 'md1', img: ms('negroni'), title: 'Members: 2 for 1 Old Fashioned', when: 'Daily · 5–7pm', venue: 'Masonry Canggu' },
        { id: 'md2', img: ms('c-charcuterie'), title: 'House charcuterie board · Rp 195k', when: 'Mon–Fri · 12–4pm', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'md3', img: ms('c-cocktails'), title: 'Martini hour in the Backroom', when: 'Daily · 5–7pm', venue: 'Masonry Canggu' },
        { id: 'md4', img: ms('j-wine'), title: 'Members: 15% off any bottle', when: 'Every night', venue: 'Masonry Canggu' },
        { id: 'mud1', img: ms('u-chablis'), title: 'Members: a glass of Chablis on arrival', when: 'Every night', venue: 'Masonry Uluwatu' },
        { id: 'mud2', img: ms('u-rolls'), title: 'Sunset small plates · Rp 145k', when: 'Daily · 5–7pm', venue: 'Masonry Uluwatu', btn: 'book', url: MS_BOOK },
        { id: 'mvd1', img: ms('v-aperitivo'), title: 'Aperitivo hour · snacks and a Negroni', when: 'Daily · 4–6pm', venue: 'Bar Vera' },
        { id: 'mvd2', img: ms('v-croquettes'), title: 'Members: small plates 2 for 1', when: 'Tue–Thu', venue: 'Bar Vera', btn: 'wa' }
      ],
      events: [
        { id: 'me1', img: ms('c-spread'), title: 'Chef’s table by the fire', line: 'Five courses, one night only', date: addDays(today, 8), time: '18:30', time2: '23:00', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK, hl: true,
          details: 'A five-course menu cooked over wood and coals, with paired wines.', price: 'Set menu, paired wines available', notes: 'Members get first pick of tables.' },
        { id: 'me2', img: ms('backroom'), title: 'Backroom sessions', line: 'DJ, cocktails and the pool table', date: addDays(today, 3), time: '21:00', time2: '01:00', venue: 'Masonry Canggu', btn: 'wa',
          details: 'A DJ in the Backroom, the bar open late.' },
        { id: 'me3', img: ms('c-yorkshire'), title: 'Christmas long lunch', line: 'Roasts from the fire, all the trimmings', date: y + '-12-25', time: '12:00', time2: '17:00', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'me5', img: ms('u-cabbage'), title: 'Sunday long lunch, Uluwatu', line: 'Sharing plates from the fire', date: nextDow(addDays(today, 1), 0), time: '12:00', time2: '16:00', venue: 'Masonry Uluwatu', btn: 'book', url: MS_BOOK,
          details: 'A long Sunday lunch of sharing plates from the grill, down south.', notes: 'Members get first pick of tables.' },
        { id: 'me4', img: ms('v-room'), title: "New Year's Eve", line: 'Dinner, then the party', date: y + '-12-31', time: '18:00', time2: '01:00', venue: 'Masonry Canggu', btn: 'wa' }
      ],
      gallery: ['window', 'beef', 'fire', 'backroom', 'c-spread', 'negroni', 'oven', 'lobster', 'terrace', 'c-cocktails', 'tartare', 'room', 'c-flatbread', 'drinks', 'c-charcuterie', 'u-scallop', 'u-cabbage', 'u-rolls', 'u-chablis']
        .map((n, i) => ({ id: 'mg' + i, img: ms(n), venue: n.startsWith('u-') ? 'Masonry Uluwatu' : 'Masonry Canggu' }))
        .concat(['v-room', 'v-bouillabaisse', 'v-martini', 'v-grouper', 'v-croquettes', 'v-aperitivo', 'v-risotto', 'v-cigars', 'v-tartare', 'v-cognac', 'v-toast', 'v-redcocktail'].map((n, i) => ({ id: 'mvg' + i, img: ms(n), venue: 'Bar Vera' }))),
      places: {
        'masonry canggu': { img: ms('room'), area: 'Batu Bolong, Canggu', ig: 'masonry.bali', menus: [{ name: 'Lunch', pages: ['lunch', 'dessert'].map(MS_MENU) }, { name: 'Dinner', pages: ['dinner', 'dessert'].map(MS_MENU) }, { name: 'Drinks', pages: ['drinks'].map(MS_MENU) }] },
        'masonry uluwatu': { img: ms('u-cabbage'), area: 'Uluwatu', ig: 'masonry.bali', menus: [{ name: 'Lunch', pages: ['lunch', 'dessert'].map(MS_MENU_U) }, { name: 'Dinner', pages: ['dinner', 'dessert'].map(MS_MENU_U) }, { name: 'Drinks', pages: ['drinks'].map(MS_MENU_U) }] },
        'masonry japan': { img: ms('japan-wide'), area: 'Niseko, Japan', ig: 'masonry.japan', soon: true },
        'bar vera': { img: ms('v-front'), area: 'Pererenan', ig: 'bar.vera.bali', other: true, menus: [{ name: 'Lunch', pages: ['lunch-1', 'lunch-2'].map(BV_MENU) }, { name: 'Dinner', pages: ['food-1'].map(BV_MENU) }, { name: 'Drinks', pages: ['drinks-1', 'drinks-2'].map(BV_MENU) }, { name: 'Brunch', pages: ['lunch-3', 'lunch-4'].map(BV_MENU) }] }   // from Bar Vera's PDFs (Robbie sent the files)
      }
    };
  }
};

// Luma (Mediterranean, Batu Bolong, Canggu) - its own demo (several shareholders, separate from Sangsaka). Photos from their site and guest posts,
// guest chef posters from Bar Luma; perks, deals and dates made up for the demo. Greeting name is a stand-in until we know who we pitch to.
const lm = n => '/demo-guest/p-luma-' + n + '.jpg';
const LUMA_WA = '6281139414999';
const LUMA_MAP = 'https://maps.google.com/?q=Luma+Jl.+Pantai+Batu+Bolong+91+Canggu';
P.luma = {
  brand: 'Luma', logo: '/demo-guest/p-luma-logo.png', icon: '/demo-guest/p-luma-icon', first: 'Olivia', tier: 'member', visits: 6, since: 2025, favourite: 'Luma',
  perks: ['10% off your bill, every visit', 'A Negroni on tap at Bar Luma on arrival', 'Bread and olives for the table, on us', 'Birthday dessert from the kitchen', 'First pick of tables for guest chef nights'],
  perkIcons: ['pct', 'cocktail', 'food', 'cake', 'star'],
  reward: { target: 10, text: 'Long lunch for two, wine included' },
  venues: [
    { name: 'Luma', area: 'Batu Bolong, Canggu', opens: '12:00', closes: '23:00', wa: LUMA_WA, phone: '+62 811 3941 4999', map: LUMA_MAP, review: LUMA_MAP },
    { name: 'Bar Luma', area: 'Terrace bar', opens: '16:00', closes: '00:00', wa: LUMA_WA, phone: '+62 811 3941 4999', map: LUMA_MAP }
  ],
  contact: { wa: LUMA_WA, phone: '+62 811 3941 4999', map: LUMA_MAP, ig: 'luma.bali' },
  acts: [
    { title: 'Vinyl on the terrace', line: 'DJs spinning records at Bar Luma', every: [5, 6], start: '20:00', end: '00:00', venue: 'Bar Luma', ic: 'music' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#2A211C', acc: '#B5553A', pg: '#F6F1EA' }, motion: true, video: '/demo-guest/p-luma-film-v2.mp4', videoTall: true,
      gift: { on: true, title: 'A long lunch, on you', line: 'Give someone a table at Luma. Tell us the amount and who it is for.', to: LUMA_WA, amounts: [500000, 1000000, 2000000], max: 5000000 },
      slides: [
        { id: 'lm1', img: lm('room'), title: 'Mediterranean, with island flavours', line: 'Under the arches on Batu Bolong', venue: 'Luma', btn: 'wa' },
        { id: 'lm2', img: lm('table'), title: 'Plates to share', line: 'Southern Europe, Balinese produce', venue: 'Luma', btn: 'wa' },
        { id: 'lm3', img: lm('lounge'), title: 'Bar Luma, on the terrace', line: 'Negroni on tap, vinyl at weekends', venue: 'Bar Luma', btn: 'wa' },
        { id: 'lm4', img: lm('lamb'), title: 'From our kitchen', line: 'Cameron Emirali and Kieran Morland', venue: 'Luma', btn: 'wa' },
        { id: 'lm5', img: lm('x-renatta'), title: 'Guest chef nights at Bar Luma', line: 'Barbecue on the terrace, vinyl DJ', venue: 'Bar Luma', btn: 'wa' }
      ],
      deals: [
        { id: 'ld1', img: lm('wine'), title: 'Happy hour · Aperol Spritz 70k', when: 'Daily · 4–7pm', venue: 'Bar Luma' },
        { id: 'ld2', img: lm('g-burrata'), title: 'Long lunch · 3 plates and a glass, Rp 395k', when: 'Mon–Fri · 12–3pm', venue: 'Luma', btn: 'wa' },
        { id: 'ld3', img: lm('g-oysters'), title: 'Members: oysters and espresso martini, 2 for 1', when: 'Thursdays · from 6pm', venue: 'Bar Luma' }
      ],
      events: [
        { id: 'le1', img: lm('x-locavore'), title: 'Bar Luma x guest chef', line: 'Barbecue on the terrace, vinyl DJ', date: nextDow(today, 6), time: '18:00', time2: '23:00', venue: 'Bar Luma', btn: 'wa', hl: true,
          details: 'A guest chef takes over the grill on the terrace for one night, with a vinyl DJ until late.', notes: 'Members get first pick of tables.' },
        { id: 'le2', img: lm('x-tinto'), title: 'Sunday long lunch', line: 'Four courses, free-flow option', date: nextDow(addDays(today, 3), 0), time: '12:00', time2: '16:00', venue: 'Luma', btn: 'wa',
          details: 'Four courses to share, with a free-flow wine option for two and a half hours.' },
        { id: 'le3', img: lm('room'), title: 'Christmas lunch', line: 'Long tables under the arches', date: y + '-12-25', time: '12:00', time2: '17:00', venue: 'Luma', btn: 'wa' },
        { id: 'le4', img: lm('lounge'), title: "New Year's Eve on the terrace", line: 'Dinner inside, DJ outside', date: y + '-12-31', time: '18:00', time2: '01:00', venue: 'Bar Luma', btn: 'wa' }
      ],
      gallery: ['street', 'room', 'table', 'lamb', 'lounge', 'g-burrata', 'g-prawns', 'g-steak', 'chefs', 'g-arches', 'g-pasta', 'g-oysters', 'terrace', 'wine', 'g-chocolate', 'g-bar', 'g-entrance', 'g-night']
        .map((n, i) => ({ id: 'lg' + i, img: lm(n), venue: ['lounge', 'wine', 'g-bar', 'g-oysters', 'g-night'].indexOf(n) >= 0 ? 'Bar Luma' : 'Luma' })),
      places: {
        'luma': { img: lm('terrace'), area: 'Batu Bolong, Canggu', ig: 'luma.bali', menus: [{ name: 'Food', pages: [1, 2].map(i => ({ img: '/demo-guest/p-luma-menu-food-' + i + '.jpg' })) }, { name: 'Wine', pages: [1, 2, 3].map(i => ({ img: '/demo-guest/p-luma-menu-wine-' + i + '.jpg' })) }, { name: 'Cocktails', pages: Array.from({ length: 3 }, (_, i) => ({ img: '/demo-guest/p-luma-menu-cocktails-' + (i + 1) + '.jpg' })) }] },
        'bar luma': { img: lm('g-bar'), area: 'Terrace bar', ig: 'luma.bali' }
      }
    };
  }
};

// Brunch Club (all-day brunch, Berawa / Pererenan / Legian) - photos from their site, hours and phone from public listings;
// perks, deals and dates made up for the demo. Logo is a stand-in until we get theirs.
const BC_MENU = [['Food', 'food', 9], ['Porncakes', 'pancakes', 2], ['Drinks', 'drinks', 5], ['Cocktails', 'cocktails', 4]].map(([name, f, k]) => ({ name, pages: Array.from({ length: k }, (_, i) => ({ img: '/demo-guest/p-brunch-menu-' + f + '-' + (i + 1) + '.jpg' })) }));   // from their own PDF menu (Robbie, Nov 2026)
const bc = n => '/demo-guest/p-brunch-' + n + '.jpg';
const BC_WA = '6281138312910';
P.brunch = {
  brand: 'Brunch Club', logo: '/demo-guest/p-brunch-logo.png', first: 'Helen', tier: 'member', visits: 8, since: 2025, favourite: 'Brunch Club Berawa',
  perks: ['10% off your bill, every visit', 'A free coffee with every brunch', 'Skip the queue at weekends', 'Birthday porncakes on us', 'First taste of new menu items'],
  perkIcons: ['pct', 'coffee', 'star', 'cake', 'sparkle'],
  reward: { target: 10, text: 'Brunch for two, porncakes included' },
  venues: [
    { name: 'Brunch Club Berawa', area: 'Berawa, Canggu', opens: '08:00', closes: '18:00', wa: BC_WA, phone: '+62 811 3831 2910' },
    { name: 'Brunch Club Pererenan', area: 'Pererenan', opens: '08:00', closes: '18:00', wa: BC_WA },
    { name: 'Brunch Club Legian', area: 'Legian', opens: '08:00', closes: '16:00', phone: '+62 819 5247 4063' },
    { name: 'Lemongrass', area: 'Jalan Melasti, Legian', opens: '11:00', closes: '23:00', wa: '6281138312907', phone: '+62 811 3831 2907', email: 'info@wearelemongrass.com' }   // same group - Thai, from their website
  ],
  contact: { wa: BC_WA, phone: '+62 811 3831 2910' },
  acts: [
    { title: 'Bottomless brunch', line: 'Free-flow drinks with any brunch', every: [0, 6], start: '10:00', end: '14:00', venue: 'Brunch Club Berawa', ic: 'cocktail' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#F48AA8', acc: '#0E4D3C', pg: '#FFFFFF' }, motion: true, video: '/demo-guest/p-brunch-film-v2.mp4', videoTall: true,
      gift: { on: true, title: 'Brunch, on you', line: 'Treat someone to brunch. Tell us the amount and who it is for.', to: BC_WA, amounts: [300000, 500000, 1000000], max: 3000000 },
      slides: [
        { id: 'bc1', img: bc('banner'), title: 'Porncakes', line: 'Three stacks, one fork', btn: 'wa' },
        { id: 'bc2', img: bc('brekkie'), title: 'The Big Brekkie', line: 'All day, every day', btn: 'wa' },
        { id: 'bc3', img: bc('lobster'), title: 'Lobster Benedict', line: 'Brioche, hollandaise, paprika', btn: 'wa' },
        { id: 'bc4', img: bc('dubai'), title: 'Dubai chocolate French toast', line: 'Pistachio, caramel, crunch', btn: 'wa' },
        { id: 'bc5', img: bc('espresso'), title: 'Brunch cocktails', line: 'Espresso martinis from 10am', btn: 'wa' },
        { id: 'bc6', img: '/demo-guest/p-lemongrass-prawns.jpg', title: 'Lemongrass · Thai since 2002', line: 'Our Thai kitchen on Jalan Melasti', venue: 'Lemongrass', btn: 'wa' },
        { id: 'bc7', img: '/demo-guest/p-lemongrass-ribs.jpg', title: 'Sticky ribs at Lemongrass', line: 'Open until 11pm', venue: 'Lemongrass', btn: 'wa' }
      ],
      deals: [
        { id: 'bcd1', img: bc('daiquiri'), title: 'Bottomless brunch · free-flow drinks', when: 'Sat–Sun · 10am–2pm', venue: 'Brunch Club Berawa', btn: 'wa' },
        { id: 'bcd2', img: bc('shake'), title: 'Members: a free shake with any porncakes', when: 'Weekdays', btn: 'wa' },
        { id: 'bcd3', img: bc('espresso'), title: 'Espresso martini 2 for 1', when: 'Daily · 2–4pm' }
      ],
      events: [
        { id: 'bce1', img: bc('caramel'), title: 'New menu tasting', line: 'Try the new dishes first', date: nextDow(today, 6), time: '10:00', time2: '13:00', venue: 'Brunch Club Berawa', btn: 'wa', hl: true,
          details: 'Members get first taste of the new menu, with a free coffee.', notes: 'Members only.' },
        { id: 'bce2', img: bc('daiquiri'), title: 'Christmas Day brunch', line: 'Bottomless and festive', date: y + '-12-25', time: '09:00', time2: '15:00', btn: 'wa' },
        { id: 'bce3', img: bc('brekkie'), title: "New Year's Day recovery brunch", line: 'Big brekkies, all day', date: (y + 1) + '-01-01', time: '09:00', time2: '16:00', btn: 'wa' }
      ],
      gallery: ['banner', 'brekkie', 'lobster', 'dubai', 'waffle', 'avo', 'caramel', 'salmon', 'halloumi', 'shake', 'daiquiri', 'espresso', 'buns', 'burger', 'allday']
        .map((n, i) => ({ id: 'bcg' + i, img: bc(n) })),
      places: {
        'brunch club berawa': { ig: 'brunch_club_bali', img: bc('waffle'), area: 'Berawa, Canggu', menus: BC_MENU },
        'brunch club pererenan': { ig: 'brunch_club_bali', img: bc('avo'), area: 'Pererenan', menus: BC_MENU },
        'brunch club legian': { ig: 'brunch_club_bali', img: bc('halloumi'), area: 'Legian', menus: BC_MENU },
        'lemongrass': { img: '/demo-guest/p-lemongrass-front.jpg', area: 'Thai · Legian', ig: 'lemongrass_bali', other: true, menus: [{ name: 'Menu', url: 'https://wearelemongrass.com/starters/' }] }
      }
    };
  }
};

const LO_WA = '6281573061887';   // Lola's Uluwatu (Time Out); Canggu has its own number below
const lo = n => '/demo-guest/p-lolas-' + n + '.jpg';
const LO_MENUS = [{ name: 'Food', pages: [1, 2, 3, 4].map(i => ({ img: lo('menu-food-' + i) })) }, { name: 'Drinks', pages: [1, 2, 3, 4].map(i => ({ img: lo('menu-drinks-' + i) })) }];   // lolasbali.com menu pages (same at Canggu and Uluwatu)
P.lolas = {
  brand: "Lola's", logo: '/demo-guest/p-lolas-logo.png', icon: '/demo-guest/p-lolas-icon', first: 'Jake', tier: 'member', visits: 6, since: 2025, favourite: "Lola's Canggu",
  perks: ['10% off your bill, every visit', 'A free margarita on your birthday', 'Chips and guac on us with any taco plate', "Priority tables on Taco Tuesday"],
  perkIcons: ['pct', 'cake', 'food', 'star'],
  reward: { target: 10, text: 'Tacos and margaritas for two' },
  venues: [
    { name: "Lola's Canggu", area: 'Jl. Subak, Canggu', opens: '08:00', closes: '00:00', wa: '6287861686721', phone: '+62 878 6168 6721' },   // Canggu number from Google (Robbie)
    { name: "Lola's Uluwatu", area: 'Jl. Labuansait, Uluwatu', opens: '12:00', closes: '00:00', wa: LO_WA, phone: '+62 815 7306 1887' },
    { name: "Lolita's Uluwatu", area: 'Jl. Labuansait, Pecatu, Uluwatu', opens: '12:00', closes: '20:00', wa: LO_WA, email: 'sociallolas@gmail.com' }   // hours + email from lolitasbali.com (no WhatsApp listed - uses Lola's Uluwatu's)
  ],
  contact: { wa: LO_WA, phone: '+62 815 7306 1887' },
  acts: [
    { title: 'DJs and margaritas', line: 'Weekend nights', every: [5, 6], start: '21:00', end: '00:00', venue: "Lola's Canggu", ic: 'party' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#141414', acc: '#C9837C', dark: true }, video: '/demo-guest/p-lolas-film-v2.mp4', videoTall: true,
      gift: { on: true, title: 'Tacos on me', line: "A Lola's voucher for someone who loves a margarita. Tell us the amount and who it is for.", to: LO_WA, amounts: [300000, 500000, 1000000], max: 3000000 },
      slides: [
        { id: 'ls1', img: lo('tacos'), title: 'Tacos, tequila, good times', line: 'Canggu and Uluwatu', venue: "Lola's Canggu", btn: 'wa' },
        { id: 'ls2', img: lo('margaritas'), title: '2 for 1 margaritas', line: 'Happy hour, every day', venue: "Lola's Uluwatu", btn: 'wa' },
        { id: 'ls3', img: lo('burrito'), title: 'Burritos the size of your arm', line: 'Made fresh, all day', venue: "Lola's Canggu", btn: 'wa' },
        { id: 'ls4', img: lo('dj'), title: 'Weekend nights at Lola’s', line: 'DJs, tequila, dancing', venue: "Lola's Canggu", btn: 'wa' },
        { id: 'ls5', img: lo('spread'), title: 'Bring the whole crew', line: 'Big tables, sharing plates', venue: "Lola's Canggu", btn: 'wa' },
        { id: 'ls6', img: '/demo-guest/p-lolita-margarita.jpg', title: "Lolita's Uluwatu", line: 'Ocean-to-table tacos over the Race Tracks wave', venue: "Lolita's Uluwatu", btn: 'wa' },
        { id: 'ls7', img: '/demo-guest/p-lolita-fish.jpg', title: 'Catch of the day, Veracruz style', line: "Chef Mauricio's November especiales", venue: "Lolita's Uluwatu", btn: 'wa' }
      ],
      deals: [
        { id: 'ld1', img: lo('margaritas'), title: '2 for 1 margaritas', when: 'Daily · happy hour', venue: "Lola's Uluwatu" },
        { id: 'ld2', img: lo('tacos2'), title: 'Taco Tuesday · members get a free taco', when: 'Tuesdays', venue: "Lola's Canggu", btn: 'wa' },
        { id: 'ld3', img: lo('plate'), title: 'Lunch plate + drink · Rp 150k', when: 'Mon–Fri · 12–3pm', venue: "Lola's Canggu" },
        { id: 'ld4', img: lo('prawns'), title: 'Members: 15% off sharing plates', when: 'Sun–Thu', venue: "Lola's Uluwatu" },
        { id: 'ld5', img: '/demo-guest/p-lolita-tamarindo.jpg', title: 'Tamarindo Sour · special this month', when: 'Daily · sunset', venue: "Lolita's Uluwatu" },
        { id: 'ld6', img: '/demo-guest/p-lolita-prawns.jpg', title: 'Members: coconut prawns 2 for 1', when: 'Tue–Thu', venue: "Lolita's Uluwatu", btn: 'wa' }
      ],
      events: [
        { id: 'le1', img: lo('party'), title: 'Lola’s Fiesta', line: 'DJs, tequila and tacos till late', date: addDays(today, 6), time: '20:00', time2: '01:00', venue: "Lola's Canggu", btn: 'wa', hl: true,
          details: 'A big night at Lola’s with DJs, tequila specials and tacos till late.', notes: 'Members skip the queue.' },
        { id: 'le2', img: lo('tacos'), title: 'Taco Tuesday', line: 'Every taco on the menu', date: addDays(today, 3), time: '17:00', time2: '23:00', venue: "Lola's Canggu", btn: 'wa' },
        { id: 'le3', img: lo('spread'), title: "New Year's Eve", line: 'The biggest fiesta of the year', date: y + '-12-31', time: '20:00', time2: '02:00', venue: "Lola's Canggu", btn: 'wa' }
      ],
      gallery: ['tacos', 'burrito', 'margaritas', 'dj', 'taco', 'spread', 'party', 'chicken', 'tacos2', 'plate', 'prawns', 'quesadilla', 'ribs', 'taco3', 'tortillas', 'team']
        .map((n, i) => ({ id: 'lg' + i, img: lo(n), venue: n === 'margaritas' || n === 'chicken' || n === 'prawns' ? "Lola's Uluwatu" : "Lola's Canggu" }))
        .concat(['margarita', 'tamale', 'salsa', 'fish', 'prawns', 'skewer', 'bartender', 'foam', 'mule', 'tamarindo'].map((n, i) => ({ id: 'lt' + i, img: '/demo-guest/p-lolita-' + n + '.jpg', venue: "Lolita's Uluwatu" }))),
      places: {
        "lola's canggu": { img: lo('taco'), area: 'Jl. Subak, Canggu', ig: 'lolasbali', menus: LO_MENUS },
        "lola's uluwatu": { img: lo('chicken'), area: 'Jl. Labuansait, Uluwatu', ig: 'lolasbali', menus: LO_MENUS },
        "lolita's uluwatu": { img: '/demo-guest/p-lolita-tamale.jpg', area: 'Above the Race Tracks wave', ig: 'lolitasbali', other: true, menus: [{ name: 'Food', pages: ['food-1', 'food-2', 'tacos-1', 'tacos-2'].map(n => ({ img: '/demo-guest/p-lolita-menu2-' + n + '.jpg' })) }, { name: 'Drinks', pages: ['drinks-1', 'drinks-2', 'drinks2-1', 'drinks2-2'].map(n => ({ img: '/demo-guest/p-lolita-menu2-' + n + '.jpg' })) }] }
      }
    };
  }
};

// Ku De Ta (Seminyak beach club) with Saltlick (its steakhouse, same group) under "Our other venues" - photos from Robbie's Drive;
// logo is a stand-in, hours are a guess and there's no WhatsApp yet (buttons go to their website until we have one); perks, deals and dates made up.
const kd = n => '/demo-guest/p-kdt-' + n + '.jpg', sl = n => '/demo-guest/p-saltlick-' + n + '.jpg';
const KDT_BOOK = 'https://www.kudeta.com';
P.kudeta = {
  brand: 'Ku De Ta', logo: '/demo-guest/p-kdt-logo.png', icon: '/demo-guest/p-kdt-icon', first: 'Matt', tier: 'member', visits: 7, since: 2025, favourite: 'Ku De Ta',
  perks: ['10% off your bill, every visit', 'A glass of bubbles on your birthday', 'Priority daybeds on weekends', 'First word on our big nights'],
  perkIcons: ['pct', 'cake', 'star', 'sparkle'],
  reward: { target: 10, text: 'A sunset daybed with a bottle of bubbles' },
  venues: [
    { name: 'Ku De Ta', area: 'Jl. Kayu Aya 9, Seminyak', opens: '08:00', closes: '00:00', book: KDT_BOOK, wa: '6285938315117', phone: '+62 361 736969', email: 'reservations@kudeta.com' },   // from kudeta.com: daily 8am - late
    { name: 'Saltlick', area: 'Upstairs at Ku De Ta, Jl. Kayu Aya 9', opens: '17:00', closes: '00:00', wa: '6282247972138', phone: '+62 822 4797 2138', email: 'reservations@saltlickbali.com' }   // from saltlickbali.com: 5pm - 12am daily
  ],
  contact: { ig: 'kudetabali', wa: '6285938315117', phone: '+62 361 736969', email: 'reservations@kudeta.com' },
  acts: [
    { title: 'Sunset sessions', line: 'DJs on the lawn as the sun goes down', every: [0, 1, 2, 3, 4, 5, 6], start: '16:00', end: '20:00', venue: 'Ku De Ta', ic: 'music' },
    { title: 'Weekend brunch', line: 'Long, lazy and by the ocean', every: [0, 6], start: '09:00', end: '13:00', venue: 'Ku De Ta', ic: 'food' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#0B0B0B', acc: '#9E1B22', dark: true }, motion: true, oneHome: true, video: '/demo-guest/p-kdt-film-v2.mp4', videoTall: true,
      gift: { on: true, title: 'A sunset, on you', line: 'Give someone a day at Ku De Ta. Tell us the amount and who it is for.', to: '6285938315117', amounts: [500000, 1000000, 2000000], max: 5000000 },
      slides: [
        { id: 'kd1', img: kd('aerial'), title: 'Your place on Seminyak beach', line: 'Daybeds, lawn and ocean', venue: 'Ku De Ta', btn: 'book', url: KDT_BOOK },
        { id: 'kd2', img: kd('sunset'), title: 'Bali\'s best sunset', line: 'Every night, front row', venue: 'Ku De Ta', btn: 'book', url: KDT_BOOK },
        { id: 'kd3', img: kd('cheers'), title: 'Bubbles by the pool', line: 'Under the red umbrellas', venue: 'Ku De Ta', btn: 'book', url: KDT_BOOK },
        { id: 'kd4', img: kd('sushi'), title: 'Sushi with a sea view', line: 'Fresh from the kitchen', venue: 'Ku De Ta', btn: 'book', url: KDT_BOOK },
        { id: 'kd5', img: sl('ig4'), title: 'Saltlick · a modern steakhouse', line: 'Built on fire, flavour and dry-aged beef', venue: 'Saltlick', btn: 'wa' },
        { id: 'kd6', img: sl('terrace'), title: 'Saltlick sunset terrace', line: 'Golden hour, a cocktail and the ocean', venue: 'Saltlick', btn: 'wa' }
      ],
      deals: [   // real promotions from kudeta.com
        { id: 'kdd1', img: kd('tray'), title: 'Orange Hour · 4 Aperol Spritz Rp 700k', when: 'Mon–Wed · 12–3pm', venue: 'Ku De Ta' },
        { id: 'kdd2', img: kd('sunset'), title: 'Sundown Sips · 2 for 1 selected cocktails', when: 'Daily · from 6pm', venue: 'Ku De Ta' },
        { id: 'kdd3', img: kd('cheers'), title: 'Wine & Waves · 15% off selected bottles', when: 'Daily', venue: 'Ku De Ta' },
        { id: 'kdd4', img: sl('byo'), title: 'BYO Wednesdays · Rp 100k corkage', when: 'Wednesdays', venue: 'Saltlick' },
        { id: 'kdd5', img: sl('s500'), title: 'Saltlick 500 · the full steak dinner, Rp 500k nett', when: 'Daily', venue: 'Saltlick', btn: 'wa' },
        { id: 'kdd6', img: sl('martini'), title: 'Martini happy hour · classic, dirty, espresso', when: 'Nightly', venue: 'Saltlick' }
      ],
      events: [   // real events from kudeta.com
        { id: 'kde1', img: kd('friends'), title: 'Sunday Market', line: 'Makers, food and cocktails on the beach', date: nextDow(today, 0), time: '10:00', time2: '16:00', venue: 'Ku De Ta', btn: 'book', url: KDT_BOOK, hl: true,
          details: 'Every Sunday Ku De Ta turns into a beachfront market: restaurants, artisan makers, local brands, family activities and signature cocktails.', notes: 'Members skip the queue at the door.' },
        { id: 'kde2', img: kd('brunch'), title: 'Ku De Ta Christmas Lunch', line: 'A long lunch by the ocean', date: y + '-12-25', time: '12:00', time2: '16:00', venue: 'Ku De Ta', btn: 'book', url: KDT_BOOK },
        { id: 'kde3', img: kd('sunset'), title: "New Year's Eve", line: 'Matt Caseli, Loco, Se/Rio and a special guest · dinner and fireworks', date: y + '-12-31', time: '18:00', time2: '02:00', venue: 'Ku De Ta', btn: 'book', url: KDT_BOOK }
      ],
      gallery: [kd('aerial'), kd('cheers'), kd('sunset'), kd('pool'), kd('friends'), kd('sushi'), kd('tray'), kd('tacos'), kd('share'), kd('pizza'), kd('ceviche'), kd('brunch'), kd('salad'), kd('cake'), sl('tbone'), sl('wagyu'), sl('mule'), sl('cuts'), sl('terrace'), sl('cocktail'), sl('team'), sl('ig1'), sl('ig2'), sl('ig4'), sl('ig5'), sl('s500'), sl('martini')]
        .map((img, i) => ({ id: 'kdg' + i, img, venue: /saltlick/.test(img) ? 'Saltlick' : 'Ku De Ta' })),
      places: {
        'ku de ta': { img: kd('cheers'), area: 'Seminyak beach', ig: 'kudetabali', menus: [{ name: 'Food & drinks', url: 'https://kudeta.com/menu/' }] },   // their menu page (PDFs can't be captured - they scroll in a viewer)
        'saltlick': { logo: '/demo-guest/p-saltlick-logo.jpg', img: sl('terrace'), area: 'Steakhouse · upstairs', ig: 'saltlickbali', other: true, acc: '#D6D1C8', menus: [['Food', 'food', 16], ['Drinks', 'drinks', 12], ['Wine', 'wine', 14]].map(([name, f, k]) => ({ name, pages: Array.from({ length: k }, (_, i) => ({ img: '/demo-guest/p-saltlick-menu-' + f + '-' + (i + 1) + '.jpg' })) })) }
      }
    };
  }
};

// Senja Beach Club: a made-up sample venue for the explainer and sales (no real venue's name, logo or numbers).
// Two of our own places (Seminyak beach club, Uluwatu cliff) plus Saffron & Salt under Our other venues. WhatsApp buttons go to the Mavis number (Robbie's ask).
const SJ_WA = '6282145328784';
const sj = n => '/demo-guest/p-senja-' + n + '.jpg';
const SJ_FOOD = [{ name: 'Food', pages: [{ img: sj('menu-food') }] }, { name: 'Drinks', pages: [{ img: sj('menu-drinks') }] }];
P.senja = {
  brand: 'Senja Beach Club', logo: '/demo-guest/p-senja-logo.png', icon: '/demo-guest/p-senja-icon', first: 'Sam', tier: 'member', visits: 6, since: 2025, favourite: 'Senja Seminyak',
  perks: ['10% off your bill, every visit', 'A free cocktail on your birthday', 'Priority sunbeds on weekends', 'First word on our big nights'],
  perkIcons: ['pct', 'cake', 'star', 'sparkle'],
  reward: { target: 10, text: 'A sunset daybed with a bottle of bubbles' },
  venues: [
    { name: 'Senja Seminyak', area: 'Beach club · Seminyak', opens: '09:00', closes: '00:00', wa: SJ_WA, map: 'https://www.google.com/maps/search/?api=1&query=Seminyak+Beach,+Bali' },
    { name: 'Senja Uluwatu', area: 'Clifftop · Uluwatu', opens: '11:00', closes: '23:00', wa: SJ_WA, map: 'https://www.google.com/maps/search/?api=1&query=Uluwatu,+Bali' },
    { name: 'Saffron & Salt', area: 'Restaurant · Seminyak', opens: '12:00', closes: '23:00', wa: SJ_WA, map: 'https://www.google.com/maps/search/?api=1&query=Seminyak,+Bali' }
  ],
  contact: { wa: SJ_WA },
  acts: [
    { title: 'Sunset sessions', line: 'DJs as the sun goes down', every: [0, 1, 2, 3, 4, 5, 6], start: '16:00', end: '20:00', venue: 'Senja Uluwatu', ic: 'music' },
    { title: 'Pool party', line: 'DJs by the pool all afternoon', every: [0, 6], start: '13:00', end: '19:00', venue: 'Senja Seminyak', ic: 'party' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#0F0D0B', acc: '#F0894A', dark: true }, motion: true, film: 'Tk2VLUUiHsc', filmStart: 0,
      gift: { on: true, title: 'A sunset, on you', line: 'Give someone a day at Senja. Tell us the amount and who it is for.', to: SJ_WA, amounts: [500000, 1000000, 2000000], max: 5000000 },
      slides: [
        { id: 'sj1', img: sj('pool'), title: 'Your day by the pool', line: 'Sunbeds, palms and the ocean', venue: 'Senja Seminyak', btn: 'wa' },
        { id: 'sj2', img: sj('uluwatu'), title: 'Sunset from the cliff', line: 'An infinity pool over the Indian Ocean', venue: 'Senja Uluwatu', btn: 'wa' },
        { id: 'sj3', img: sj('cocktails'), title: 'Cocktails on the sand', line: 'Mango, passionfruit, paloma', venue: 'Senja Seminyak', btn: 'wa' },
        { id: 'sj4', img: sj('dj'), title: 'DJs every afternoon', line: 'From lunch till late', venue: 'Senja Seminyak', btn: 'wa' },
        { id: 'sj5', img: sj('lanterns'), title: 'Saffron & Salt', line: 'Dinner by lantern light', venue: 'Saffron & Salt', btn: 'wa' }
      ],
      deals: [
        { id: 'sjd1', img: sj('cheers'), title: 'Golden hour · 2 for 1 cocktails', when: 'Daily · 4–6pm', venue: 'Senja Seminyak' },
        { id: 'sjd2', img: sj('beach'), title: 'Members: a free cocktail with any daybed', when: 'Weekdays', venue: 'Senja Seminyak', btn: 'wa' },
        { id: 'sjd3', img: sj('oysters'), title: 'Oyster hour · Rp 25k each', when: 'Fridays · 5–7pm', venue: 'Senja Uluwatu' },
        { id: 'sjd4', img: sj('steak'), title: 'Steak night · a free glass of red', when: 'Tuesdays', venue: 'Saffron & Salt', btn: 'wa' }
      ],
      events: [
        { id: 'sje1', img: sj('djsunset'), title: 'Sunset on the cliff', line: 'Guest DJ from 4pm', date: nextDow(today, 6), time: '16:00', time2: '23:00', venue: 'Senja Uluwatu', btn: 'wa', hl: true,
          details: 'A guest DJ plays the cliff from golden hour into the night.', notes: 'Members skip the queue at the door.' },
        { id: 'sje2', img: sj('crowd'), title: 'Full moon party', line: 'Big night, all night', date: addDays(today, 12), time: '20:00', time2: '03:00', venue: 'Senja Seminyak', btn: 'wa' },
        { id: 'sje3', img: sj('lamb'), title: 'Christmas dinner', line: 'A long table, by lantern light', date: y + '-12-25', time: '18:00', time2: '23:00', venue: 'Saffron & Salt', btn: 'wa' },
        { id: 'sje4', img: sj('cocktails'), title: "New Year's Eve", line: 'The biggest night on the beach', date: y + '-12-31', time: '18:00', time2: '02:00', venue: 'Senja Seminyak', btn: 'wa' }
      ],
      gallery: [['pool', 'Senja Seminyak'], ['beach', 'Senja Seminyak'], ['cocktails', 'Senja Seminyak'], ['dj', 'Senja Seminyak'], ['mango', 'Senja Seminyak'], ['cheers', 'Senja Seminyak'], ['crowd', 'Senja Seminyak'],
        ['uluwatu', 'Senja Uluwatu'], ['djsunset', 'Senja Uluwatu'], ['oysters', 'Senja Uluwatu'], ['pina', 'Senja Uluwatu'], ['lemongrass', 'Senja Uluwatu'],
        ['lanterns', 'Saffron & Salt'], ['steak', 'Saffron & Salt'], ['lamb', 'Saffron & Salt'], ['fish', 'Saffron & Salt'], ['octopus2', 'Saffron & Salt'], ['bread', 'Saffron & Salt'], ['clams', 'Saffron & Salt'], ['green', 'Saffron & Salt']]
        .map(([n, v], i) => ({ id: 'sjg' + i, img: sj(n), venue: v })),
      places: {
        'senja seminyak': { img: sj('beach'), area: 'Beach club · pool', menus: SJ_FOOD },
        'senja uluwatu': { img: sj('uluwatu'), area: 'Clifftop · sunset', menus: SJ_FOOD },
        'saffron & salt': { img: sj('lanterns'), area: 'Restaurant · Seminyak', other: true, menus: [{ name: 'Menu', pages: [{ img: '/demo-guest/p-saffron-menu.jpg' }] }] }
      }
    };
  }
};

// Sunset Beach (Seminyak, by Mrs Sippy) - photos and details from Robbie + sunsetbeachbali.com; happy hour is real, other deals made up.
// Mrs Sippy goes under Our other venues once we have its photos.
const sb = n => '/demo-guest/p-sunset-' + n + '.jpg';
const SB_WA = '6281237814448';
const ms2 = n => '/demo-guest/p-sippy-' + n + '.jpg';
const SIPPY_MENU = n => [1, 2, 3].map(k => ({ img: ms2('menu-' + n + '-' + k) }));   // Mrs Sippy menu PDFs (Sept 2026), each page cut into its 3 columns
const SB_MENU = (n, k) => Array.from({ length: k }, (_, i) => ({ img: '/demo-guest/p-sunset-menu-' + n + '-' + (i + 1) + '.jpg' }));   // from sunsetbeachbali.com menu pages
P.sunset = {
  brand: 'Sunset Beach', logo: '/demo-guest/p-sunset-logo.png', icon: '/demo-guest/p-sunset-icon', first: 'Andrew', tier: 'member', visits: 5, since: 2025, favourite: 'Sunset Beach',
  perks: ['10% off your bill, every visit', 'A free cocktail on your birthday', 'Priority sunbeds on weekends', 'First word on our big nights'],
  perkIcons: ['pct', 'cake', 'star', 'sparkle'],
  reward: { target: 10, text: 'A sunset daybed with a bottle of bubbles' },
  venues: [{ name: 'Sunset Beach', area: 'Jl. Camplung Tanduk 99, Seminyak', opens: '10:00', closes: '22:00', wa: SB_WA, phone: '+62 812 3781 4448', email: 'hello@sunsetbeachbali.com', map: 'https://maps.google.com/?q=Sunset%20Beach%20Bali%2C%20Jl.%20Camplung%20Tanduk%2099%2C%20Seminyak' },
    { name: 'Mrs Sippy', area: 'Jl. Taman Ganesha, Kerobokan Kelod, Seminyak', opens: '10:00', closes: '21:00', wa: '6282145001007', phone: '+62 821 4500 1007', email: 'reservations@mrssippybali.com', map: 'https://www.google.com/maps/search/?api=1&query=Mrs+Sippy+Bali' }   // from mrssippybali.com
  ],
  contact: { wa: SB_WA, phone: '+62 812 3781 4448', email: 'hello@sunsetbeachbali.com' },
  acts: [
    { title: 'Happy hour', line: '2 for 1 Bali Hai, seltzers and slushies', every: [1, 2, 3, 4, 5], start: '12:00', end: '14:00', venue: 'Sunset Beach', ic: 'drinks' },
    { title: 'Sunset happy hour', line: '2 for 1 Negronis, espresso martinis, spritz', every: [1, 2, 3, 4, 5], start: '19:00', end: '21:00', venue: 'Sunset Beach', ic: 'drinks' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#0B1129', acc: '#CDA86B', dark: true, dkbg: '#0B1129' }, motion: true, oneHome: true, video: '/demo-guest/p-sunset-film-v2.mp4', videoTall: true,
      gift: { on: true, title: 'A sunset, on you', line: 'Give someone a day on Seminyak beach. Tell us the amount and who it is for.', to: SB_WA, amounts: [500000, 1000000, 2000000], max: 5000000 },
      slides: [
        { id: 'sb1', img: sb('hut'), title: 'Your spot on Seminyak beach', line: 'Good music, open skies, great food', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sb2', img: sb('sunsetgirls'), title: 'Stay for the sunset', line: 'Open every day, 10am to 10pm', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sb3', img: sb('tables'), title: 'Dinner by the sea', line: 'Fire-driven cooking and mezze to share', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sb4', img: sb('spritz'), title: 'Cocktails at the bar', line: 'Classic margaritas to sunset spritz', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sb5', img: sb('arches'), title: 'Bring the crew', line: 'Groups, birthdays and long lunches', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sb6', img: ms2('dive'), title: 'Mrs Sippy · Eat, swim, play', line: "Seminyak's saltwater pool club, with the diving board", venue: 'Mrs Sippy', btn: 'wa' },
        { id: 'sb7', img: ms2('feast'), title: 'Seafood market at Mrs Sippy', line: 'Prawns, lobster and fish off the grill', venue: 'Mrs Sippy', btn: 'wa' }
      ],
      deals: [
        { id: 'sbd1', img: sb('happyhour'), title: 'Happy hour · 2 for 1', when: 'Mon–Fri · 12–2pm & 7–9pm', venue: 'Sunset Beach' },
        { id: 'sbd2', img: sb('beanbags'), title: 'Members: a free cocktail with any daybed', when: 'Weekdays', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sbd4', img: sb('tables'), title: 'Weekday lunch · 3 small plates Rp 195k, 2 courses Rp 295k', when: 'Mon–Fri · 12–3pm', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sbd5', img: ms2('watermelon'), title: 'Members: pool entry included (save Rp150k)', when: 'Weekdays', venue: 'Mrs Sippy', btn: 'wa' },
        { id: 'sbd3', img: sb('aerial'), title: 'Group bookings · 10+ guests', when: 'Any day · ask us', venue: 'Sunset Beach', btn: 'wa' }
      ],
      events: [
        { id: 'sbe1', img: sb('band'), title: 'Sunday Club', line: 'DJs, sunbeds and sunset', date: nextDow(today, 0), time: '12:00', time2: '22:00', venue: 'Sunset Beach', btn: 'wa', hl: true,
          details: 'Our Sunday session: DJs from lunch, cocktails by the pool and the best sunset in Seminyak.', notes: 'Members skip the queue.' },
        { id: 'sbe4', img: ms2('stage'), title: 'Saturday pool party', line: 'DJs, drinks and the diving board', date: nextDow(today, 6), time: '13:00', time2: '19:00', venue: 'Mrs Sippy', btn: 'wa' },
        { id: 'sbe2', img: sb('grill'), title: 'Christmas at Sunset Beach', line: 'A festive long lunch by the sea', date: y + '-12-25', time: '12:00', time2: '22:00', venue: 'Sunset Beach', btn: 'wa' },
        { id: 'sbe3', img: sb('dusk'), title: "New Year's Eve", line: 'The biggest night on the beach', date: y + '-12-31', time: '18:00', time2: '02:00', venue: 'Sunset Beach', btn: 'wa' }
      ],
      gallery: ['hut', 'sunsetgirls', 'tables', 'spritz', 'palms', 'cocktails2', 'prawns', 'arches', 'band', 'bartender', 'mule', 'umbrella', 'dj', 'beanbags', 'friends2', 'grill', 'waiter', 'aerial', 'signsil', 'dusk', 'happyhour'].map((n, i) => ({ id: 'sbg' + i, img: sb(n), venue: 'Sunset Beach' }))
        .concat(['aerial', 'dive', 'pool', 'frozen', 'coconut', 'seafood', 'prawns', 'feast', 'pizza', 'bartender', 'watermelon', 'friends', 'stage'].map((n, i) => ({ id: 'msg' + i, img: ms2(n), venue: 'Mrs Sippy' }))),
      places: { 'sunset beach': { img: sb('palms'), area: 'Seminyak beach', ig: 'sunsetbeachbali', menus: [
        { name: 'Food', pages: SB_MENU('bc-food', 4) }, { name: 'Drinks', pages: SB_MENU('grill-drinks', 6) },   // the Beach Club drinks capture was too small to read; the Grill drinks list is sharper and covers the same
        { name: 'The Grill', pages: SB_MENU('grill-food', 4) }, { name: 'Lunch deals', pages: SB_MENU('lunch', 2) }] },
        'mrs sippy': { img: ms2('aerial'), area: 'Pool club · Seminyak', ig: 'mrssippybali', other: true, acc: '#3FB6BD', menus: [{ name: 'Food', pages: ['food-1', 'food-2'].flatMap(SIPPY_MENU) }, { name: 'Drinks', pages: ['drinks-1', 'drinks-2'].flatMap(SIPPY_MENU) }] } }
    };
  }
};

// South + East Brewing Co. (Kerobokan) - photos and video from Robbie's Drive, menus from their May 2026 PDFs, hours/phone from Google.
// Real: 24 taps, Pizza Day Wednesday 100k, beer flights, Sunday Roast, group/party bookings. Member perks and the birthday deal are made up.
const se = n => '/demo-guest/p-se-' + n + '.jpg';
const SE_WA = '6285216000383';
const SE_MENU = (n, a, b) => Array.from({ length: b - a + 1 }, (_, i) => ({ img: '/demo-guest/p-se-menu-' + n + '-' + (a + i) + '.jpg' }));
P.southeast = {
  brand: 'South + East', logo: '/demo-guest/p-se-logo.png', icon: '/demo-guest/p-se-icon', first: 'Jack', tier: 'member', visits: 4, since: 2025, favourite: 'South + East',
  perks: ['10% off your bill, every visit', 'A free pint on your birthday', 'First pour of every new beer', 'Priority on group bookings'],
  perkIcons: ['pct', 'cake', 'star', 'sparkle'],
  reward: { target: 10, text: 'A 6-beer flight and a platter for the table' },
  venues: [{ name: 'South + East', area: 'Jl. Pengubengan Kauh, Kerobokan Kelod', opens: '12:00', closes: '00:00', wa: SE_WA, phone: '+62 852 1600 0383', email: 'info@southeastbrewing.co',
    map: 'https://www.google.com/maps/search/?api=1&query=South+%2B+East+Brewing+Co+Kerobokan+Bali' }],
  contact: { wa: SE_WA, phone: '+62 852 1600 0383', email: 'info@southeastbrewing.co' },
  acts: [
    { title: 'Pizza Day', line: 'Any pizza Rp 100k', every: [3], start: '12:00', end: '23:30', venue: 'South + East', ic: 'star' },
    { title: 'Sunday Roast', line: 'Slow-roast, Yorkshire pudding and gravy', every: [0], start: '12:00', end: '23:30', venue: 'South + East', ic: 'star' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#141414', acc: '#EB9B80', dark: true }, motion: true, video: '/demo-guest/p-se-film.mp4',
      gift: { on: true, title: 'A round on you', line: 'Give someone a night of craft beer and good food. Tell us the amount and who it is for.', to: SE_WA, amounts: [250000, 500000, 1000000], max: 5000000 },
      slides: [
        { id: 'se1', img: se('rhinos'), title: '24 taps, rice-field views', line: 'Local and international craft beer, poured fresh', venue: 'South + East', btn: 'wa' },
        { id: 'se2', img: se('chicken'), title: 'South African meets Indonesian', line: 'Peri-peri chicken, biltong bitterballen and Balinese spice', venue: 'South + East', btn: 'wa' },
        { id: 'se3', img: se('brekkie'), title: 'Breakfast, all day', line: 'Sourdough, eggs your way and proper coffee', venue: 'South + East', btn: 'wa' },
        { id: 'se4', img: se('band'), title: 'Live music and DJs', line: 'Good tunes, cold beer, open air', venue: 'South + East', btn: 'wa' },
        { id: 'se5', img: se('kids'), title: 'Bring the family', line: 'Kids welcome, dogs too', venue: 'South + East', btn: 'wa' },
        { id: 'se6', img: se('crew'), title: 'Plan your party at South + East', line: 'Birthdays and groups: turn your event into your own bar', venue: 'South + East', btn: 'wa' }
      ],
      deals: [
        { id: 'sed1', img: se('pizzaday'), title: 'Pizza Day · any pizza Rp 100k', when: 'Wednesdays', venue: 'South + East' },
        { id: 'sed2', img: se('beer'), title: 'Beer flights · 3 for Rp 120k, 6 for Rp 200k', when: 'Every day', venue: 'South + East' },
        { id: 'sed3', img: se('cans'), title: 'Happy hour on the starred taps', when: 'Ask at the bar', venue: 'South + East' },
        { id: 'sed4', img: se('cheers'), title: 'Members: a free pint on your birthday week', when: 'Any day', venue: 'South + East', btn: 'wa' }
      ],
      events: [
        { id: 'see1', img: se('lamb'), title: 'Sunday Roast', line: 'Slow-roast, Yorkshire pudding and gravy', date: nextDow(today, 0), time: '12:00', time2: '23:30', venue: 'South + East', btn: 'wa', hl: true,
          details: 'Our Sunday Roast South + East: slow-roast with roast potatoes, seasonal vegetables and a Yorkshire pudding, with brown gravy.', notes: 'Members: book your table on WhatsApp.' },
        { id: 'see3', img: se('lads'), title: "New Year's Eve at South + East", line: 'Craft beer, DJs and the countdown', date: y + '-12-31', time: '18:00', time2: '01:00', venue: 'South + East', btn: 'wa' }
      ],
      gallery: ['front', 'rhinos', 'cheers', 'crew', 'lads', 'laugh', 'band', 'dj', 'dj2', 'beer', 'cans', 'cocktails', 'mary', 'burger', 'pizza', 'chicken', 'ribs', 'porkbelly', 'lamb', 'brekkie', 'avo', 'friedchicken', 'croquettes', 'wings']
        .map((n, i) => ({ id: 'seg' + i, img: se(n), venue: 'South + East' })),
      places: { 'south + east': { img: se('front'), area: 'Craft beer · fusion kitchen', ig: 'southeastbrewing', menus: [{ name: 'Food', pages: SE_MENU('food', 2, 5) }, { name: 'Drinks', pages: SE_MENU('drinks', 2, 8) }] } }
    };
  }
};

// Mama San (Kerobokan / Seminyak, Will Meyrick) - photos and video from Robbie's Drive, menus cut from mamasanbali.com captures (Nov 2026).
// Real: hours, WhatsApp, email, Vietnamese lunch specials 12-5pm, upstairs lounge and group dining. Member perks and deals made up.
const mm = n => '/demo-guest/p-mms-' + n + '.jpg';
const MM_WA = '6281806126700';
const HL_WA = '6281353260275';
const HS_WA = '6282215151586';
const BH_WA = '6287735522232';   // Billy Ho, Canggu (sister venue, from billyho.co)   // Honey & Smoke, Ubud (sister venue, from honeyandsmoke.co)   // Hujan Locale, Ubud (sister venue, from hujanlocale.com)
const MM_MENU = (n, parts) => parts.flatMap(([c, k]) => Array.from({ length: k }, (_, i) => ({ img: '/demo-guest/p-mms-menu-' + n + '-' + c + String.fromCharCode(97 + i) + '.jpg' })));
P.mamasan = {
  brand: 'Mama San', logo: '/demo-guest/p-mms-logo.png', icon: '/demo-guest/p-mms-icon', first: 'Will', tier: 'member', visits: 5, since: 2025, favourite: 'Mama San',
  perks: ['10% off your bill, every visit', 'A free cocktail on your birthday', 'Priority tables on busy nights', 'First taste of every new menu'],
  perkIcons: ['pct', 'cake', 'star', 'sparkle'],
  reward: { target: 10, text: 'The Feed Me menu for two' },
  venues: [{ name: 'Mama San', area: 'Jl. Raya Kerobokan No.135, Kerobokan Kelod', opens: '12:00', closes: '22:30', wa: MM_WA, phone: '+62 818 0612 6700', email: 'booking@mamasanbali.com',
    map: 'https://www.google.com/maps/search/?api=1&query=Mama+San+Bali+Jalan+Raya+Kerobokan+135' },
    { name: 'Hujan Locale', area: 'Jl. Sri Wedari No.5, Ubud', opens: '12:00', closes: '22:00', wa: HL_WA, phone: '+62 813 5326 0275', email: 'reservation@hujanlocale.com',
      map: 'https://www.google.com/maps/search/?api=1&query=Hujan+Locale+Ubud' },
    { name: 'Honey & Smoke', area: 'Jl. Monkey Forest No.67B, Ubud', opens: '12:00', closes: '22:00', wa: HS_WA, phone: '+62 822 1515 1586', email: 'reservation@honeyandsmoke.co',
      map: 'https://www.google.com/maps/search/?api=1&query=Honey+%26+Smoke+Ubud' },
    { name: 'Billy Ho', area: 'Jl. Pantai Batu Bolong, Canggu', opens: '11:00', closes: '23:00', wa: BH_WA, phone: '+62 877 3552 2232', email: 'booking@billyho.co',
      map: 'https://www.google.com/maps/search/?api=1&query=Billy+Ho+Canggu' }],
  contact: { wa: MM_WA, phone: '+62 818 0612 6700', email: 'booking@mamasanbali.com' },
  acts: [
    { title: 'DJs in the Lounge', line: 'Vinyl upstairs into the late evening', every: [5, 6], start: '20:00', end: '00:00', venue: 'Mama San', ic: 'party' },
    { title: 'Vietnamese lunch specials', line: 'Pho, banh mi and Vietnamese coffee', every: [1, 2, 3], start: '12:00', end: '17:00', venue: 'Mama San', ic: 'star' },
    { title: 'Keroncong live music', line: 'Orkes Bali Classic at Hujan Locale, Ubud', every: [2, 5], start: '19:30', end: '21:30', venue: 'Hujan Locale', ic: 'party' },
    { title: 'Jazz DJ Nights', line: 'Upstairs in the Supper Club, margaritas at the bar', every: [4, 6], start: '19:00', end: '23:00', venue: 'Honey & Smoke', ic: 'party' },
    { title: 'DJs at Billy Ho', line: 'Dinner, a cocktail and a DJ who reads the room', every: [5, 6], start: '19:00', end: '22:00', venue: 'Billy Ho', ic: 'party' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#22211C', acc: '#CDA86B', dark: true, dkbg: '#1A1915' }, motion: true, video: '/demo-guest/p-mms-film.mp4', videoTall: true,
      gift: { on: true, title: 'Dinner at Mama San, on you', line: 'Give someone a great night out at Mama San. Valid 12 months. Tell us the amount and who it is for.', to: MM_WA, amounts: [500000, 1000000, 1500000, 2000000], max: 10000000 },
      slides: [
        { id: 'mm1', img: mm('wo-flavours'), title: 'Bold New Flavours', line: 'Char siu claypot, Northern Thai hotpot and Malaysian kandar curry', venue: 'Mama San', btn: 'wa' },
        { id: 'mm2', img: mm('wo-lunch'), title: 'Vietnamese Lunch', line: 'Pho, banh mi and pork la lot, every day 12-5pm', venue: 'Mama San', btn: 'wa' },
        { id: 'mm3', img: mm('wo-coffee'), title: 'Vietnamese Coffees', line: 'Phin drip, egg coffee and coconut, daily 12-5pm', venue: 'Mama San' },
        { id: 'mm4', img: mm('wo-groups'), title: 'Group Dining', line: 'Big tables, big flavours: set menus for 10 to 20 guests', venue: 'Mama San', btn: 'wa' },
        { id: 'mm5', img: mm('wo-private'), title: 'Private Events', line: 'Launches, weddings, private dinners: the house is yours', venue: 'Mama San', btn: 'wa' },
        { id: 'mm6', img: mm('upstairs'), title: 'The Lounge upstairs', line: 'Vinyl-spinning DJs into the late evening', venue: 'Mama San', btn: 'wa' }
      ],
      deals: [
        { id: 'mmd1', img: mm('banhmi'), title: 'Vietnamese lunch specials', when: 'Every day · 12–5pm', venue: 'Mama San' },
        { id: 'mmd2', img: mm('coffee'), title: 'Vietnamese coffees from Rp 50k', when: 'Every day · 12–5pm', venue: 'Mama San' },
        { id: 'mmd3', img: mm('bar'), title: 'Members: a cocktail on us with dinner for two', when: 'Dinner · from 5:30pm', venue: 'Mama San', btn: 'wa' },
        { id: 'mmd4', img: mm('table'), title: 'Group set menus · 10 to 20 guests', when: 'Lunch and dinner · ask us', venue: 'Mama San', btn: 'wa' }
      ],
      events: [
        { id: 'mme1', img: mm('upstairs'), title: 'DJs in the Lounge', line: 'Vinyl upstairs into the late evening', date: nextDow(today, 6), time: '20:00', time2: '00:00', venue: 'Mama San', btn: 'wa', hl: true,
          details: 'Upstairs, the Mama San Lounge is one of Seminyak\'s best hideaways, where vinyl-spinning DJs carry the room into the late evening.', notes: 'Members: tell us you are coming and we will hold you a spot.' },
        { id: 'mme2', img: '/demo-guest/p-hl-keroncong.jpg', title: 'Keroncong at Hujan Locale', line: "Indonesia's 500-year-old rhythm, live in Ubud", date: nextDow(today, 5), time: '19:30', time2: '21:30', venue: 'Hujan Locale', btn: 'wa',
          details: 'Every Tuesday and Friday, Orkes Bali Classic brings Keroncong, Indonesia\'s centuries-old rhythm born from Portuguese shores, to Hujan Locale. Come for dinner and stay for the music.', notes: 'These evenings fill quickly, so book ahead.' },
        { id: 'mme4', img: '/demo-guest/p-hs-jazz.jpg', title: 'Jazz DJ Nights at Honey & Smoke', line: 'Jazz on the decks, margaritas at the bar', date: nextDow(today, 4), time: '19:00', time2: '23:00', venue: 'Honey & Smoke', btn: 'wa',
          details: 'Every Thursday and Saturday from 7pm, a live DJ takes over the Honey & Smoke speakeasy bar upstairs with an evening of jazz. Classic, Tommy\'s or Chilli Lime Margaritas at IDR 120k++ each.', notes: 'Upstairs seats fill quickly on jazz nights, so book ahead.' },
        { id: 'mme5', img: '/demo-guest/p-bh-ramen.jpg', title: 'Ramen Club at Billy Ho', line: 'Pick your ramen, add a cocktail for 90k, live DJ', date: nextDow(today, 5), time: '19:00', time2: '22:00', venue: 'Billy Ho', btn: 'wa',
          details: 'Friday night ramen at Billy Ho: rich tonkotsu, spicy miso, shoyu or something lighter, with one of our signature cocktails for just 90k. From 7pm our resident DJs set the mood.', notes: 'Book your table on WhatsApp.' },
        { id: 'mme6', img: '/demo-guest/p-bh-dj.jpg', title: 'The room sounds better on weekends', line: 'Live DJs at Billy Ho, Fridays and Saturdays 7-10pm', date: nextDow(today, 6), time: '19:00', time2: '22:00', venue: 'Billy Ho', btn: 'wa',
          details: 'Every Friday and Saturday our resident DJs play from 7 to 10pm. Not louder. Just right. Settle in with dinner and signature cocktails, all in cool, air-conditioned comfort.', notes: 'Send this to your weekend crew and book your table.' },
        { id: 'mme3', img: mm('chandelier'), title: "New Year's Eve at Mama San", line: 'A long dinner and the countdown', date: y + '-12-31', time: '18:00', time2: '01:00', venue: 'Mama San', btn: 'wa' }
      ],
      gallery: ['lounge', 'diners', 'chandelier', 'bar', 'dining', 'table', 'upstairs', 'group', 'hargow', 'lobster', 'pho', 'banhmi', 'laab', 'tuna', 'puri', 'buns', 'fish', 'porkhock', 'duckrice', 'parfait', 'coffee']
        .map((n, i) => ({ id: 'mmg' + i, img: mm(n), venue: 'Mama San' })),
      places: { 'mama san': { img: mm('chandelier'), area: 'Southeast Asian · Seminyak', ig: 'mamasanbali', menus: [
        { name: 'Lunch', pages: Array.from({ length: 12 }, (_, i) => ({ img: '/demo-guest/p-mms-menu-lunchv3-' + (i + 1) + '.jpg' })) }, { name: 'Dinner', pages: Array.from({ length: 12 }, (_, i) => ({ img: '/demo-guest/p-mms-menu-dinnerv3-' + (i + 1) + '.jpg' })) },
        { name: 'Drinks', pages: Array.from({ length: 6 }, (_, i) => ({ img: '/demo-guest/p-mms-menu-drinksv3-' + (i + 1) + '.jpg' })) }, { name: 'Wine', pages: Array.from({ length: 7 }, (_, i) => ({ img: '/demo-guest/p-mms-menu-winev3-' + (i + 1) + '.jpg' })) }] },
        'hujan locale': { img: '/demo-guest/p-hl-front.jpg', area: 'Indonesian · Ubud', ig: 'hujan_locale', other: true, logo: '/demo-guest/p-hl-logo.png', acc: '#C8714F',
          menus: [['Lunch', 'lunch', 10], ['Dinner', 'dinner', 8], ['Drinks', 'drinks', 5], ['Wine', 'wine', 3]].map(([name, f, k]) => ({ name, pages: Array.from({ length: k }, (_, i) => ({ img: '/demo-guest/p-hl-menu-' + f + '-' + (i + 1) + '.jpg' })) })) },   // menus from Hujan Locale's own pages (Ctrl+P PDFs), re-set as text
        'honey & smoke': { img: '/demo-guest/p-hs-front.jpg', area: 'Bistro grill & jazz supper club · Ubud', ig: 'honeyandsmoke.co', other: true, logo: '/demo-guest/p-hs-logo.png', acc: '#D6C8AA',
          menus: [['Lunch', 'lunch', 9], ['Dinner', 'dinner', 9], ['Drinks', 'drinks', 6], ['Wine', 'wine', 6]].map(([name, f, k]) => ({ name, pages: Array.from({ length: k }, (_, i) => ({ img: '/demo-guest/p-hs-menu-' + f + '-' + (i + 1) + '.jpg' })) })) },
        'billy ho': { img: '/demo-guest/p-bh-front.jpg', area: 'Modern Japanese · Canggu', ig: 'billyho.co', other: true, logo: '/demo-guest/p-bh-logo.png', acc: '#B5694F',
          menus: [{ name: 'Lunch', url: 'https://billyho.co/menus/lunch-menu/' }, { name: 'Dinner', url: 'https://billyho.co/menus/dinner-menu/' }, { name: 'Drinks', url: 'https://billyho.co/menus/drinks-menu/' }, { name: 'Wine', url: 'https://billyho.co/menus/wine-list/' }] } }
    };
  }
};

// Mozaic (Ubud, since 2001; Chef Blake Thornley) - photos and video from Robbie's Drive; spaces, hours, contact and What's On from mozaic-bali.com (Robbie's capture, Nov 2026);
// menus from their own PDFs. Member perks and the members' deals are made up.
const mz = n => '/demo-guest/p-mz-' + n + '.jpg';
const MZ_WA = '6282147235550';
const MZ_BOOK = 'https://booking.resdiary.com/widget/Standard/MozaicBali/4947';   // their ResDiary booking (from mozaic-bali.com)
const MZ_MENU = (name, f, k) => ({ name, pages: Array.from({ length: k }, (_, i) => ({ img: '/demo-guest/p-mz-menu-' + f + '-' + (i + 1) + '.jpg' })) });
P.mozaic = {
  brand: 'Mozaic', logo: '/demo-guest/p-mz-logo.png', icon: '/demo-guest/p-mz-icon', first: 'Chris', tier: 'member', visits: 3, since: 2025, favourite: 'The Dining Room',
  perks: ['A glass of champagne in the Tipple Room, every visit', 'A gift from the kitchen on your birthday', 'First pick of tables for special dinners', 'First word on new seasonal menus'],
  perkIcons: ['star', 'cake', 'pct', 'sparkle'],
  reward: { target: 6, text: "A seat at the Chef's Table for two" },
  venues: [
    { name: 'The Dining Room', area: 'Jl. Raya Sanggingan, Ubud', opens: '18:00', closes: '22:00', wa: MZ_WA, book: MZ_BOOK, phone: '+62 361 975 768', email: 'info@mozaic-bali.com', map: 'https://www.google.com/maps/search/?api=1&query=Mozaic+Restaurant+Ubud' },
    { name: 'Tipple Room', area: 'Jl. Raya Sanggingan, Ubud', opens: '17:00', closes: '00:30', wa: MZ_WA, book: MZ_BOOK, phone: '+62 361 975 768', email: 'info@mozaic-bali.com', map: 'https://www.google.com/maps/search/?api=1&query=Mozaic+Restaurant+Ubud' },
    { name: "Chef's Table", area: 'The Workshop, Mozaic', wa: MZ_WA, phone: '+62 361 975 768', email: 'info@mozaic-bali.com', map: 'https://www.google.com/maps/search/?api=1&query=Mozaic+Restaurant+Ubud' },
    { name: 'Romantic Gazebo', area: 'In the garden, Mozaic', wa: MZ_WA, phone: '+62 361 975 768', email: 'info@mozaic-bali.com', map: 'https://www.google.com/maps/search/?api=1&query=Mozaic+Restaurant+Ubud' }
,
    { name: 'Spice by Blake', area: 'Jl. Monkey Forest, Ubud', wa: '6281234586169', phone: '+62 812 3458 6169', email: 'info@spicebali.com', map: 'https://www.google.com/maps/search/?api=1&query=Spice+by+Blake+Ubud' }   // sister restaurant, same chef
  ],
  contact: { wa: MZ_WA, phone: '+62 361 975 768', email: 'info@mozaic-bali.com' },
  acts: [
    { title: 'Lunch at Mozaic', line: 'Six courses at the Tipple Room Kitchen, from 1pm', every: [4, 5, 6], start: '13:00', end: '16:00', venue: 'Tipple Room', ic: 'star' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#141210', acc: '#1F6B4F', pg: '#F5F1EA' }, motion: true, video: '/demo-guest/p-mz-film.mp4', videoTall: true,
      gift: { on: true, title: 'A night at Mozaic, on you', line: 'Give someone the gastronomic journey. Tell us the amount and who it is for.', to: MZ_WA, amounts: [1000000, 2000000, 5000000], max: 20000000 },
      slides: [
        { id: 'mz1', img: mz('dining'), title: 'The gastronomic journey', line: 'Since 2001: begin in the Tipple Room, dine, finish in the garden', venue: 'The Dining Room', btn: 'wa' },
        { id: 'mz2', img: mz('tipple'), title: 'Start in the Tipple Room', line: 'Canapés, opening bites and crafted cocktails', venue: 'Tipple Room', btn: 'wa' },
        { id: 'mz3', img: mz('trout'), title: 'Seasonal tasting menu', line: 'Bali produce, with optional wine pairing', venue: 'The Dining Room', btn: 'wa' },
        { id: 'mz4', img: mz('chefstable'), title: "Chef's Table in the Workshop", line: 'Watch the team cook in front of you', venue: "Chef's Table", btn: 'wa' },
        { id: 'mz5', img: mz('gazebo'), title: 'Romantica', line: 'A private garden gazebo for two, with champagne and wine pairing', venue: 'Romantic Gazebo', btn: 'wa' },
        { id: 'mz6', img: mz('chef'), title: 'Chef Blake Thornley', line: 'Leading the Mozaic kitchen', venue: 'The Dining Room' }
      ],
      deals: [
        { id: 'mzd1', img: mz('wo-lunch'), title: 'Lunch at Mozaic · 6 courses from IDR 1,250,000++', when: 'Thu, Fri & Sat · 1pm', venue: 'Tipple Room', btn: 'wa' },
        { id: 'mzd2', img: mz('cocktails'), title: 'Members: your first cocktail on us in the Tipple Room', when: 'Daily · from 5pm', venue: 'Tipple Room', btn: 'wa' },
        { id: 'mzd3', img: mz('garden'), title: 'Members: dessert in the garden with any tasting menu', when: 'Daily · from 6pm', venue: 'The Dining Room', btn: 'wa' }
      ],
      events: [
        { id: 'mze1', img: mz('wo-25'), title: '25 Years of Mozaic', line: 'An eight-course legacy menu with five guest chefs', date: y + '-12-05', time: '18:00', time2: '23:00', venue: 'The Dining Room', btn: 'wa', hl: true,
          details: "Join Chef Blake Thornley and five of Bali's most distinguished chefs for an exclusive anniversary dinner: an eight-course legacy menu celebrating 25 years of Mozaic. Every reservation enters a draw for a two-night retreat at Secret Moon Bali. IDR 1,800,000++ per person.", notes: 'Reservations are essential.' },
        { id: 'mze2', img: mz('wo-xmas'), title: 'Christmas Dinner at Mozaic', line: 'Eight-course festive tasting menu', date: y + '-12-24', time: '18:00', time2: '23:00', venue: 'The Dining Room', btn: 'book', url: MZ_BOOK + '?date=' + y + '-12-24&promotionId=297928',
          details: 'A special eight-course festive dinner by Chef Blake Thornley, on 24 and 25 December. IDR 1,900,000++ per person, from 6pm.', notes: 'Reservation required.' },
        { id: 'mze3', img: '/demo-guest/p-sb-smoky.jpg', title: 'The Smoky Collab · Spice × Bola Bali', line: 'Smoked pork ribs and urutan hotdogs, one night only', date: y + '-11-20', time: '16:00', time2: '22:00', venue: 'Spice by Blake', btn: 'wa',
          details: 'For one evening only, Spice by Blake joins forces with Bola Bali for a celebration of fire, smoke and seriously good food: smoky pork ribs, urutan hotdogs and bold flavours.', notes: 'Come hungry and bring your favourite people.' }
      ],
      gallery: ['dining', 'tipple', 'tipple2', 'garden', 'couple', 'gazebo', 'chefstable', 'workshop', 'chef', 'chefpan', 'trout', 'wagyu', 'beef', 'duck', 'yolk', 'caviar', 'fish', 'soup', 'plate', 'dessert', 'cocktails', 'cocktail', 'tea', 'ricefields']
        .map((n, i) => ({ id: 'mzg' + i, img: mz(n), venue: i < 3 ? 'Tipple Room' : i < 6 ? 'Romantic Gazebo' : i < 10 ? "Chef's Table" : 'The Dining Room' })),
      places: {
        'the dining room': { img: mz('dining'), area: 'Seasonal tasting menus', ig: 'mozaicbali', menus: [MZ_MENU('Seasonal', 'seasonal', 2), MZ_MENU('Botanical', 'botanical', 2), MZ_MENU('Wine', 'wine', 12)] },
        'tipple room': { img: mz('tipple2'), area: 'Cocktails & canapés', ig: 'mozaicbali', menus: [MZ_MENU('Cocktails', 'cocktails', 2)] },
        "chef's table": { img: mz('chefstable'), area: 'Private dining · the Workshop', ig: 'mozaicbali', menus: [MZ_MENU('Sample menu', 'chefs', 2)] },
        'romantic gazebo': { img: mz('gazebo'), area: 'Romantica · for two', ig: 'mozaicbali', menus: [MZ_MENU('Romantica', 'romantica', 4)] },
        'spice by blake': { img: '/demo-guest/p-sb-room.jpg', area: 'Modern Indonesian · Ubud', ig: 'spicebyblakethornley', other: true, logo: '/demo-guest/p-sb-logo.png', acc: '#D9785B', menus: [{ name: 'Food & drinks', url: 'https://spicebali.com/our-menu/' }] }
      }
    };
  }
};

// Spice by Blake (Monkey Forest Rd, Ubud; founded 2015 by Chef Chris Salans, now led by Chef Blake Thornley, who also leads Mozaic) - photos and video
// from Robbie's Drive; contact, story and The Smoky Collab from spicebali.com (Robbie's capture, Nov 2026). Menus to come. Member perks and deals made up.
const sbk = n => '/demo-guest/p-sb-' + n + '.jpg';
const SPB_WA = '6281234586169';
P.spiceblake = {
  brand: 'Spice by Blake', logo: '/demo-guest/p-sb-logo.png', icon: '/demo-guest/p-sb-icon', first: 'Blake', tier: 'member', visits: 4, since: 2025, favourite: 'Spice by Blake',
  perks: ['10% off your bill, every visit', 'A free cocktail on your birthday', 'First seats at the kitchen counter', 'First taste of new dishes'],
  perkIcons: ['pct', 'cake', 'star', 'sparkle'],
  reward: { target: 8, text: "Blake's feast menu for two" },
  venues: [{ name: 'Spice by Blake', area: 'Jl. Monkey Forest, Ubud', wa: SPB_WA, phone: '+62 812 3458 6169', email: 'info@spicebali.com', map: 'https://www.google.com/maps/search/?api=1&query=Spice+by+Blake+Ubud' },
    { name: 'Mozaic', area: 'Jl. Raya Sanggingan, Ubud', opens: '18:00', closes: '22:00', wa: MZ_WA, book: MZ_BOOK, phone: '+62 361 975 768', email: 'info@mozaic-bali.com', map: 'https://www.google.com/maps/search/?api=1&query=Mozaic+Restaurant+Ubud' }],
  contact: { wa: SPB_WA, phone: '+62 812 3458 6169', email: 'info@spicebali.com' },
  acts: [],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#141210', acc: '#D9785B', pg: '#F5F1EA' }, motion: true, oneHome: true, video: '/demo-guest/p-sb-film.mp4', videoTall: true,
      gift: { on: true, title: 'A night at Spice, on you', line: 'Give someone a table at Spice. Tell us the amount and who it is for.', to: SPB_WA, amounts: [500000, 1000000, 2000000], max: 10000000 },
      slides: [
        { id: 'sb1', img: sbk('hero'), title: 'Modern Indonesian in Ubud', line: 'Best Modern Indonesian Restaurant, Exquisite Awards 2025', venue: 'Spice by Blake', btn: 'wa' },
        { id: 'sb1b', img: sbk('room'), title: 'An open kitchen, a lively bar', line: 'The heat of the grill and the rhythm of the team, right in front of you', venue: 'Spice by Blake', btn: 'wa' },
        { id: 'sb2', img: sbk('skewers'), title: 'Off the grill', line: 'Sate and skewers over charcoal', venue: 'Spice by Blake', btn: 'wa' },
        { id: 'sb3', img: sbk('counter'), title: 'Eat at the counter', line: 'Front row to the open kitchen', venue: 'Spice by Blake', btn: 'wa' },
        { id: 'sb4', img: sbk('cocktails'), title: 'Our cocktails', line: 'Indonesian herbs, spices and tropical fruits', venue: 'Spice by Blake', btn: 'wa' },
        { id: 'sb5', img: sbk('boat'), title: 'Spice at sea', line: 'Private dining on the water', venue: 'Spice by Blake', btn: 'wa' },
        { id: 'sb6', img: mz('dining'), title: 'Mozaic · by the same chef', line: 'Fine dining in Ubud since 2001', venue: 'Mozaic', btn: 'book', url: MZ_BOOK }
      ],
      deals: [
        { id: 'sbd1', img: sbk('feast'), title: 'Members: a free cocktail with any sharing feast', when: 'Any day', venue: 'Spice by Blake', btn: 'wa' },
        { id: 'sbd2', img: sbk('table'), title: 'Group dining · sharing menus for 8+', when: 'Any day · ask us', venue: 'Spice by Blake', btn: 'wa' }
      ],
      events: [
        { id: 'sbe0', img: sbk('smoky'), title: 'The Smoky Collab · Spice × Bola Bali', line: 'Smoked pork ribs and urutan hotdogs, one night only', date: y + '-11-20', time: '16:00', time2: '22:00', venue: 'Spice by Blake', btn: 'wa', hl: true,
          details: 'For one evening only, Spice by Blake joins forces with Bola Bali for a flavour-packed celebration of fire, smoke and seriously good food: juicy smoky pork ribs, urutan hotdogs and bold flavours made for getting your hands a little messy.', notes: 'Come hungry and bring your favourite people.' },
        { id: 'sbe1', img: mz('wo-25'), title: '25 Years of Mozaic', line: 'Chef Blake and five guest chefs, eight courses', date: y + '-12-05', time: '18:00', time2: '23:00', venue: 'Mozaic', btn: 'book', url: MZ_BOOK,
          details: "Chef Blake Thornley and five of Bali's most distinguished chefs cook an eight-course legacy menu at Mozaic, Ubud. IDR 1,800,000++ per person.", notes: 'Reservations are essential.' }
      ],
      gallery: ['hero', 'room', 'kitchen', 'counter', 'bar', 'stairs', 'boat', 'blake', 'grill', 'chefs', 'table', 'feast', 'share', 'skewers', 'ribs', 'curry', 'rolls', 'rice', 'fritters', 'prawns', 'salad', 'chicken', 'dessert', 'cocktails', 'spices', 'boatdish', 'plate']
        .map((n, i) => ({ id: 'sbg' + i, img: sbk(n), venue: 'Spice by Blake' })),
      places: {
        'spice by blake': { img: sbk('room'), area: 'Modern Indonesian · Ubud', ig: 'spicebyblakethornley', menus: [{ name: 'Food & drinks', url: 'https://spicebali.com/our-menu/' }] },
        'mozaic': { img: mz('dining'), area: 'Fine dining · Ubud', ig: 'mozaicbali', other: true, logo: '/demo-guest/p-mz-logo.png', acc: '#1F6B4F', menus: [MZ_MENU('Seasonal', 'seasonal', 2), MZ_MENU('Botanical', 'botanical', 2), MZ_MENU('Wine', 'wine', 12)] }
      }
    };
  }
};

// Every demo place gets a map: a Google Maps search for its name and area, unless we set a real link (Senja is made up: its maps point at the area)
Object.entries(P).forEach(([k, v]) => k !== 'senja' && (v.venues || []).forEach(x => { if (!x.map) x.map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(x.name + ', ' + (x.area || '') + ', Bali'); }));

// Ulu Cliffhouse (Uluwatu clifftop beach club) - photos from Robbie's Drive; hours, phone and the Off The Record Saturday party from Time Out / Megatix.
// Real logo (Robbie); WhatsApp from ulucliffhouse.com contact page; no menus yet; member deals made up.
const ul = n => '/demo-guest/p-ulu-' + n + '.jpg';
const UL_BOOK = 'https://www.ulucliffhouse.com';
const bu = n => '/demo-guest/p-burnt-' + n + '.jpg';   // burnt photos from ulucliffhouse.com (Robbie's screenshots)
const UL_MENU = n => ({ img: '/demo-guest/p-ulu-menu-' + n + '.jpg' });   // retyped in their menu style from Google Maps menu photos (their PDFs are broken)
P.ulu = {
  brand: 'Ulu Cliffhouse', logo: '/demo-guest/p-ulu-logo.png', icon: '/demo-guest/p-ulu-icon', first: 'Josh', tier: 'member', visits: 6, since: 2025, favourite: 'Ulu Cliffhouse',
  perks: ['10% off your bill, every visit', 'A free cocktail on your birthday', 'Priority daybeds on weekends', 'First word on our big nights'],
  perkIcons: ['pct', 'cake', 'star', 'sparkle'],
  reward: { target: 10, text: 'A clifftop daybed with a bottle of bubbles' },
  venues: [{ name: 'Ulu Cliffhouse', area: 'Clifftop · Pecatu, Uluwatu', opens: '08:00', closes: '22:00', book: UL_BOOK, wa: '6281139417899', phone: '+62 813 3881 2502', map: 'https://www.google.com/maps/search/?api=1&query=Ulu+Cliffhouse+Bali' },
    { name: 'burnt', area: 'Live-fire restaurant at Ulu Cliffhouse', opens: '17:00', closes: '23:00', book: UL_BOOK, wa: '6281139417899', map: 'https://www.google.com/maps/search/?api=1&query=Ulu+Cliffhouse+Bali' }   // Ulu's evening fire restaurant (ulucliffhouse.com/burnt); hours a guess - dinner from sunset
  ],
  contact: { wa: '6281139417899', phone: '+62 813 3881 2502' },
  acts: [
    { title: 'Off The Record', line: 'Saturday pool party · DJs from 1pm to sunset', every: [6], start: '13:00', end: '19:00', venue: 'Ulu Cliffhouse', ic: 'party' },
    { title: 'Sunrise yoga on the cliff', line: 'Over the ocean', every: [2, 4], start: '08:00', end: '09:00', venue: 'Ulu Cliffhouse', ic: 'star' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#1E1B18', acc: '#E8C547', dark: true }, motion: true,
      gift: { on: true, title: 'A day on the cliff, on you', line: 'Give someone a daybed at Ulu. Tell us the amount and who it is for.', to: '6281139417899', amounts: [500000, 1000000, 2000000], max: 5000000 }, video: '/demo-guest/p-ulu-film-v2.mp4', videoTall: true,
      slides: [
        { id: 'ul1', img: ul('pool'), title: 'Your daybed on the cliff', line: 'Pool, palms and the Indian Ocean', venue: 'Ulu Cliffhouse', btn: 'book', url: UL_BOOK },
        { id: 'ul2', img: ul('lounge'), title: 'Golden hour, front row', line: 'Sunset lounge over the waves', venue: 'Ulu Cliffhouse', btn: 'book', url: UL_BOOK },
        { id: 'ul3', img: ul('deck'), title: 'Down the steps to the sea deck', line: 'Our bar above the reef', venue: 'Ulu Cliffhouse' },
        { id: 'ul4', img: ul('brunch'), title: 'Breakfast from 8am', line: 'Coffee, eggs and ocean views', venue: 'Ulu Cliffhouse', btn: 'book', url: UL_BOOK },
        { id: 'ul5', img: ul('dinner'), title: 'Dinner under the lanterns', line: 'Wood-fired plates and bubbles', venue: 'Ulu Cliffhouse', btn: 'book', url: UL_BOOK },
        { id: 'ub1', img: bu('fire'), title: 'burnt', line: 'Cooked over wood and charcoal: local seafood, dry-aged meats, seasonal produce', venue: 'burnt', btn: 'book', url: UL_BOOK },
        { id: 'ub2', img: bu('dining'), title: 'Dining Room & Bar', line: 'The open fire kitchen sits at the centre of the room', venue: 'burnt', btn: 'book', url: UL_BOOK },
        { id: 'ub3', img: bu('terrace'), title: 'Sunset Terrace', line: 'Watch the sun drop into the Indian Ocean as the flames get to work', venue: 'burnt', btn: 'book', url: UL_BOOK },
        { id: 'ub4', img: bu('chef'), title: 'The people behind burnt', line: 'Chef Tomás, Bar Manager Dedi and Sous Chef Frendy', venue: 'burnt' }
      ],
      deals: [
        { id: 'uld1', img: ul('pool'), title: 'Off The Record daybeds · from Rp 1.5m min. spend', when: 'Saturdays · 1–7pm', venue: 'Ulu Cliffhouse' },
        { id: 'uld2', img: ul('table'), title: 'Members: golden hour cocktails 2 for 1', when: 'Daily · 5–7pm', venue: 'Ulu Cliffhouse' },
        { id: 'uld4', img: bu('wine'), title: 'Members: a glass of bubbles at sunset with dinner', when: 'Daily · from 5pm', venue: 'burnt', btn: 'wa' },
        { id: 'uld3', img: ul('breakfast'), title: 'Members: a free coffee with any breakfast', when: 'Weekdays · 8–11am', venue: 'Ulu Cliffhouse' }
      ],
      events: [
        { id: 'ule1', img: ul('dj'), title: 'Off The Record', line: 'Pool party from the afternoon until sunset', date: nextDow(today, 6), time: '13:00', time2: '19:00', venue: 'Ulu Cliffhouse', btn: 'book', url: 'https://megatix.asia/events/off-the-record', hl: true,
          details: 'Ulu\'s Saturday pool party series: DJs poolside from 1pm until sunset. Daybeds from Rp 1.5m minimum spend, Hex Bar daybeds Rp 2.5m, cabanas Rp 4m.', notes: 'Members get first pick of daybeds.' },
        { id: 'ule2', img: ul('disco'), title: 'Sundays at Ulu', line: 'Play all day, dance after dark', date: nextDow(today, 0), time: '12:00', time2: '00:00', venue: 'Ulu Cliffhouse', btn: 'book', url: UL_BOOK },
        { id: 'ule3', img: ul('fireworks'), title: "New Year's Eve on the cliff", line: 'Fireworks over the ocean', date: y + '-12-31', time: '18:00', time2: '02:00', venue: 'Ulu Cliffhouse', btn: 'book', url: UL_BOOK }
      ],
      gallery: ['aerial', 'pool', 'lounge', 'deck', 'waves', 'table', 'restaurant', 'bar', 'brunch', 'breakfast', 'sandwich', 'dinner', 'yoga', 'dj', 'disco', 'fireworks'].map((n, i) => ({ id: 'ulg' + i, img: ul(n), venue: 'Ulu Cliffhouse' }))
        .concat(['fire', 'steak', 'fish', 'dining', 'terrace', 'fire2', 'plating', 'wine', 'chef'].map((n, i) => ({ id: 'ubg' + i, img: bu(n), venue: 'burnt' }))),
      places: { 'ulu cliffhouse': { img: ul('aerial'), area: 'Clifftop · Uluwatu', ig: 'ulucliffhouse', menus: [{ name: 'Poolside', pages: ['pool-1', 'pool-2'].map(UL_MENU) }, { name: 'Drinks', pages: ['drinks-1', 'drinks-2'].map(UL_MENU) }] },
        'burnt': { logo: '/demo-guest/p-burnt-logo.jpg', img: bu('fire2'), area: 'Live-fire dining · sunset terrace', ig: 'ulucliffhouse', other: true, acc: '#C8642A', menus: [{ name: 'Dinner', pages: ['aftersun-1', 'aftersun-2', 'after'].map(UL_MENU) }, { name: 'Drinks', pages: ['drinks-1', 'drinks-2'].map(UL_MENU) }] } }
    };
  }
};

const CODES = { U4LUCH: 'ulu', S2NSET: 'sunset', S3NJAB: 'senja', K8SNGA: 'sangsaka', B6PADL: 'bpa', S8HLTR: 'shelter', T7RNSB: 'trans', '5NKGZJ': 'trans', S4DK7R: 'sundari', M3SNRY: 'masonry', L5UMAB: 'luma', B7RNCH: 'brunch', L7LASQ: 'lolas', K2DETA: 'kudeta', S9LTLK: 'kudeta', S3EAST: 'southeast', M6MSAN: 'mamasan', M8ZAIC: 'mozaic', S6PBLK: 'spiceblake', T6RSBY: 'transsby' };   // L5UMAB = Luma keyring: its own Luma demo (different owners from Sangsaka)   // 5NKGZJ = the printed sample card, shown as Trans for the GM demo
// Mavis Club network: each of the guest's other venues as a logo tile (their colour, logo, how long they've been a member there)
const KEY_CODE = { ulu: 'U4LUCH', sunset: 'S2NSET', senja: 'S3NJAB', sangsaka: 'K8SNGA', bpa: 'B6PADL', shelter: 'S8HLTR', trans: 'T7RNSB', sundari: 'S4DK7R', masonry: 'M3SNRY', luma: 'L5UMAB', brunch: 'B7RNCH', lolas: 'L7LASQ', kudeta: 'K2DETA', southeast: 'S3EAST', mamasan: 'M6MSAN', mozaic: 'M8ZAIC', spiceblake: 'S6PBLK', transsby: 'T6RSBY' };
const club = (list, who) => list.map(c => { const v = P[c.key]; if (!v) return null; const t = (v.content('2026-01-01').theme) || {};
  return { name: v.brand, logo: v.logo, top: t.top || '#0F1E2E', area: (v.venues[0] || {}).area || '', since: c.since || '', visits: c.visits || 0,
    href: '/k/' + KEY_CODE[c.key] + '?n=' + encodeURIComponent(String(who || '').split(' ')[0]) }; }).filter(Boolean);
// The back office demo dressed as a prospect (Settings in the app: Mavis demo company): everything its editor starts from
const seed = (key, today) => { const v = P[key]; if (!v) return null;
  return { as: key, brand: v.brand, logo: v.logo,
    content: Object.assign(v.content(today), { as: key, acts: (v.acts || []).map(a => Object.assign({}, a)) }),
    page: { as: key, venues: v.venues.map(x => Object.assign({}, x)), reward: v.reward ? { visits: v.reward.target, text: v.reward.text } : null, contact: v.contact || {}, stay: v.stay || '', stayWa: v.stayWa || '', stayPhone: v.stayPhone || '' },
    perks: { member: v.perks.slice(), vip: v.perks.slice(), icons: { member: v.perkIcons.slice(), vip: v.perkIcons.slice() } } }; };
module.exports = { get: code => P[CODES[code]] || null, keyOf: code => CODES[code] || '', nextDow, club, seed };
