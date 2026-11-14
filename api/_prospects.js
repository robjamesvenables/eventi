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
          { id: 'ps0', img: sh('entrance'), title: 'Welcome back to Shelter', line: 'Your table under the trees', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps1', img: sh('longtable'), title: 'Shelter Sessions', line: 'Long tables, one night, one fire', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps2', img: sh('flame'), title: 'Wood roasted moon scallops', line: 'Lemon butter, chilli salt', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps3', img: sh('cocktails'), title: 'Sundowners from 5pm', line: 'Mezcal, agave and fresh fruit', venue: 'Shelter Pererenan' },
          { id: 'ps4', img: sh('party'), title: 'Celebrate with us', line: 'Birthdays, big nights, the whole crew', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK },
          { id: 'ps5', img: sh('coals'), title: 'Charred over coals, by hand', line: 'Wood-fired Middle Eastern', venue: 'Shelter Uluwatu' }
        ],
        deals: [
          { id: 'pd1', img: sh('cocktails'), title: 'Mezcal hour · 2 for 1 Sinaloa', when: 'Daily · 5–7pm', venue: 'Shelter Pererenan' },
          { id: 'pd2', img: sh('salmon'), title: 'Long lunch · 3 courses Rp 395k', when: 'Mon–Fri · 12–3pm', venue: 'Shelter Pererenan' },
          { id: 'pd3', img: sh('pig'), title: 'Sunday BBQ · sharing feast', when: 'Sundays · from 12pm', venue: 'Shelter Pererenan' },
          { id: 'pd4', img: sh('table'), title: 'Book the long table · 10+ guests', when: 'Any night · ask us', venue: 'Shelter Pererenan' }
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
        gallery: ['entrance', 'longtable', 'flame', 'room', 'bread', 'cocktails', 'grill', 'salmon', 'kitchen', 'octo', 'party', 'kofta', 'pig', 'table', 'chef', 'fire', 'scallops', 'barra', 'flatbread', 'octopus', 'pork', 'drink', 'coals'].map((n, i) => ({ id: 'pg' + i, img: sh(n), venue: n === 'coals' ? 'Shelter Uluwatu' : 'Shelter Pererenan' })),
        gift: { on: true, title: 'A night at Shelter', line: 'Give someone a seat by the fire. Tell us the amount and who it is for.', to: '6282340040199', amounts: [500000, 1000000, 2000000], max: 5000000, bonus: 10 },
        places: {
          'shelter pererenan': { img: sh('entrance'), area: 'Pererenan', ig: 'shelter.pererenan', menus: [
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
  club: [{ key: 'shelter', since: 'Mar 2025', visits: 3 }],
   // Mavis Club network demo: the other venues this guest belongs to (shown only when switched on)
  guide: 'trans',   // its guest guide (/g/trans): Hotel guide button on the member page
  brand: 'The Trans Resort Bali', logo: '/demo-guest/p-trans-logo.png', icon: '/demo-guest/p-trans-icon', first: 'Alexander', tier: 'vip', visits: 6, since: 2025, favourite: 'The 18th',   // icon: home-screen app icon (-192.png and -512.png)
  perks: ['Welcome drink at The 18th Rooftop', 'Late check-out until 2pm, when available', '15% off at the spa', 'Free kids club afternoons'],
  perkIcons: ['cocktail', 'key', 'leaf', 'smile'],
  reward: { target: 10, text: 'One night in a pool villa' },
  venues: ['The 18th Rooftop Bar', 'The Restaurant', 'The Lobby Lounge'].map(name => ({ name, ...({ 'The 18th Rooftop Bar': { opens: '17:00', closes: '23:00' }, 'The Restaurant': { opens: '06:30', closes: '23:00' }, 'The Lobby Lounge': { opens: '11:00', closes: '19:00' } }[name] || {}), area: 'Seminyak', map: 'https://www.google.com/maps/dir/?api=1&destination=The+Trans+Resort+Bali&destination_place_id=ChIJSdIXcT1H0i0R0vTqmwjznss', review: 'https://search.google.com/local/writereview?placeid=ChIJSdIXcT1H0i0R0vTqmwjznss' })),
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
    return {
      others: { on: true, list: [{ id: 'sby', name: 'The Trans Luxury Hotel', city: 'Surabaya', img: '/demo-guest/p-sby-beachclub.jpg', line: '28th Sky Beach Club · 27th Sky Lounge · Rooms',
    places: [{ name: '28th Sky Beach Club', img: '/demo-guest/p-sby-beachclub.jpg', line: 'A Bali beach club, 28 floors up', opens: '12:00', closes: '00:00' },
      { name: '27th Sky Lounge', img: '/demo-guest/p-sby-skylounge.jpg', line: 'Cocktails over the city', opens: '12:00', closes: '00:00' },
      { name: 'The Lounge', img: '/demo-guest/p-sby-lounge.jpg', line: 'Coffee, tea and light bites' }],
    rooms: [{ name: 'Premier Room', img: '/demo-guest/p-sby-room-premier.jpg' }, { name: 'Executive Club', img: '/demo-guest/p-sby-room-execclub.jpg' },
      { name: 'Celebrity Suite', img: '/demo-guest/p-sby-room-celebrity.jpg' }, { name: 'Presidential Suite', img: '/demo-guest/p-sby-room-presidential.jpg' }],
    book: 'https://www.transhotelgroup.com/hotel_overview/45' }] },
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
        'the 18th rooftop bar': { img: tr('18lounge'), area: 'Rooftop · sunset views', ig: 'thetransresortbali', menus: [{ name: 'Food & drinks', pages: [{ img: '/demo-guest/p-trans-18th-menu-01.jpg' }, { img: '/demo-guest/p-trans-18th-menu-02.jpg' }, { img: '/demo-guest/p-trans-18th-menu-03.jpg' }, { img: '/demo-guest/p-trans-18th-menu-04.jpg' }, { img: '/demo-guest/p-trans-18th-menu-05.jpg' }, { img: '/demo-guest/p-trans-18th-menu-06.jpg' }, { img: '/demo-guest/p-trans-18th-menu-07.jpg' }, { img: '/demo-guest/p-trans-18th-menu-08.jpg' }, { img: '/demo-guest/p-trans-18th-menu-09.jpg' }, { img: '/demo-guest/p-trans-18th-menu-10.jpg' }] }] },
        'the restaurant': { img: tr('restoroom'), area: 'All-day dining by the pool', ig: 'thetransresortbali', menus: [{ name: 'Food & drinks', pages: [{ img: '/demo-guest/p-trans-restaurant-menu-1.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-2.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-3.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-4.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-5.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-6.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-7.jpg' }, { img: '/demo-guest/p-trans-restaurant-menu-8.jpg' }] }] },
        'the lobby lounge': { img: tr('llroom'), area: 'Coffee, tea and cocktails', ig: 'thetransresortbali', menus: [{ name: 'Food & drinks', pages: [{ img: '/demo-guest/p-trans-lounge-menu-1.jpg' }, { img: '/demo-guest/p-trans-lounge-menu-2.jpg' }, { img: '/demo-guest/p-trans-lounge-menu-3.jpg' }, { img: '/demo-guest/p-trans-lounge-menu-4.jpg' }] }] }
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
  brand: 'Bali Padel Academy', logo: '/demo-guest/p-bpa-logo.png', icon: '/demo-guest/p-bpa-icon', first: 'Eric', tier: 'vip', visits: 7, since: 2024, favourite: 'Padel Courts',
  perks: ['Member prices at the restaurant', '15% off in the pro shop', 'Free pool access after your game', 'Kids play free in the play park'],
  perkIcons: ['food', 'tag', 'sun', 'smile'],
  reward: { target: 10, text: 'A free NOX ball tube and smoothie' },
  venues: [
    { name: 'Padel Courts', opens: '06:30', closes: '23:00', book: PT },
    { name: 'Restaurant', opens: '07:00', closes: '22:00' },
    { name: 'Pro Shop', opens: '08:00', closes: '21:00' },
    { name: 'Infinity Pool', opens: '07:00', closes: '20:00' },
    { name: 'Kids Area', opens: '08:00', closes: '19:00' }
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
      theme: { top: '#B7CBB0', acc: '#111111', pg: '#F4F6F2' }, motion: true, film: '9U1XjJJN0ks', filmStart: 7,
      slides: [
        { id: 'bs0', img: bp('events'), title: 'NOX Cup · tournament night', line: 'Finals under the lights', venue: 'Padel Courts', ev: 'be1' },
        { id: 'bs1', img: bp('courts'), title: '7 panoramic courts', line: 'Book in one tap', venue: 'Padel Courts', btn: 'book', url: PT },
        { id: 'bs5', img: bp('lounge'), title: 'New or playing solo?', line: 'Our front desk will find you a game', venue: 'Padel Courts' },
        { id: 'bs2', img: bp('pool'), title: 'Cool down in the infinity pool', line: 'Free for members after your game', venue: 'Infinity Pool' },
        { id: 'bs3', img: bp('nox'), title: 'Powered by NOX', line: 'Try the new rackets in our pro shop', venue: 'Pro Shop' },
        { id: 'bs4', img: bp('building'), title: 'Sauna & ice bath', line: 'Coming soon · members first', venue: '' }
      ],
      deals: [
        { id: 'bd1', img: bp('lounge'), title: 'Smoothie hour · 2 for 1', when: 'Mon - Fri · 5 - 7pm', venue: 'Restaurant' },
        { id: 'bd2', img: bp('nox'), title: 'NOX rackets · members 15% off', when: 'This week', venue: 'Pro Shop' },
        { id: 'bd3', img: bp('pool'), title: 'Kids play free while you play', when: 'Every day', venue: 'Kids Area' }
      ],
      events: [
        { id: 'be1', img: bp('events'), title: 'NOX Cup · December', line: 'Bali\'s biggest padel weekend', date: y + '-12-12', time: '09:00', time2: '22:00', venue: 'Padel Courts', btn: 'book', url: PT, hl: true,
          details: 'Two days of padel on all 7 courts, finals on the NOX Stadium court, DJ and food all weekend.' },
        { id: 'be2', img: bp('courts'), title: 'Members Americana night', line: 'Mixed levels · drinks after', date: addDays(today, 5), time: '18:00', time2: '21:00', venue: 'Padel Courts', btn: 'book', url: PT }
      ],
      gallery: ['building', 'courts', 'lounge', 'events', 'pool', 'nox'].map((n, i) => ({ id: 'bg' + i, img: bp(n), venue: '' })),
      places: {
        'padel courts': { img: bp('courts'), area: '7 panoramic courts · NOX Stadium', ig: 'balipadelacademy', menus: [{ name: 'Lessons & prices', pages: [{ img: '/demo-guest/p-bpa-lessons.jpg' }] }] },
        'restaurant': { img: bp('events'), area: 'All-day food, coffee and smoothies', ig: 'balipadelacademy' },
        'pro shop': { img: bp('nox'), area: 'NOX rackets, balls and gear' },
        'infinity pool': { img: bp('pool'), area: 'Swim after your game' },
        'kids area': { img: bp('building'), area: 'Kids academy · ages 5 - 14', menus: [{ name: 'Kids academy', pages: [{ img: '/demo-guest/p-bpa-lessons.jpg' }] }] }
      }
    };
  }
};

// Sundari Wellness (Seminyak day spa) - photos and logo from their own website
const su = n => '/demo-guest/p-sun-' + n + '.jpg';
const SUN_WA = '62811365563';
P.sundari = {
  brand: 'Sundari Wellness', logo: '/demo-guest/p-sundari-logo.png', icon: '/demo-guest/p-sundari-icon', first: 'Ayu', tier: 'vip', visits: 4, since: 2025, favourite: 'Sundari Wellness',
  perks: ['10% off every treatment', 'A birthday ritual on us', "Members-only treatment of the month", 'First pick of your favourite therapist'],
  perkIcons: ['leaf', 'cake', 'star', 'heart'],
  reward: { target: 10, text: 'A 60-minute Balinese massage' },
  venues: [{ name: 'Sundari Wellness', area: 'Seminyak', opens: '09:00', closes: '22:00', wa: SUN_WA, phone: '+62 811 365 563', map: 'https://maps.google.com/?q=SUNDARI%20Wellness%2C%20Jalan%20Petitenget%207%2C%20Seminyak%2C%20Bali' }],
  contact: { wa: SUN_WA, phone: '+62 811 365 563' },
  acts: [],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#5E2A17', acc: '#7D3A20', pg: '#F7F2EC' }, motion: true,
      gift: { on: true, title: 'The gift of a slow afternoon', line: 'A spa voucher for someone who needs it. Tell us the amount and who it is for.', to: SUN_WA, amounts: [500000, 1000000, 2000000], max: 5000000, bonus: 10 },
      slides: [
        { id: 'us0', img: su('bath'), title: 'Flower bath ritual', line: 'Warm water, petals, nowhere to be', btn: 'wa' },
        { id: 'us1', img: su('cave'), title: 'Your quiet place in Seminyak', line: 'Open every day, 9am to 10pm', btn: 'wa' },
        { id: 'us2', img: su('massage'), title: 'Balinese massage', line: 'The one everyone comes back for', btn: 'wa' },
        { id: 'us3', img: su('couples'), title: 'Side by side', line: 'Couples rooms, two therapists', btn: 'wa' },
        { id: 'us4', img: su('pods'), title: 'Start with your feet', line: 'Foot ritual in our woven pods', btn: 'wa' },
        { id: 'us5', img: su('shop'), title: 'Take Sundari home', line: 'Oils, robes and singing bowls in our shop' }
      ],
      deals: [
        { id: 'ud1', img: su('pedi'), title: 'Reflexology add-on for members', when: 'Every day · 9am–5pm', btn: 'wa' },
        { id: 'ud2', img: su('daybed'), title: 'Travel recovery after your flight', when: 'Every day', btn: 'wa' },
        { id: 'ud3', img: su('room'), title: 'Members: 90 minutes for the price of 60', when: 'Mon–Thu · before 2pm', btn: 'wa' },
        { id: 'ud4', img: su('hands'), title: 'Signature polish with any massage', when: 'Mon–Thu', btn: 'wa' }
      ],
      events: [
        { id: 'ue1', img: su('couples'), title: 'Couples ritual week', line: 'Two therapists, one room, together', date: addDays(today, 6), time: '10:00', time2: '20:00', btn: 'wa', hl: true,
          details: 'Book a room for two and enjoy the same ritual side by side. Members book first.' },
        { id: 'ue2', img: su('bamboo'), title: 'Christmas gift vouchers', line: 'The gift that always fits', date: y + '-12-24', btn: 'wa',
          details: 'Treatment vouchers for friends and family, ready to send on WhatsApp.' }
      ],
      gallery: ['bath', 'cave', 'corridor', 'massage', 'pods', 'couples', 'reception', 'shop', 'room', 'daybed', 'lounge2', 'pedi', 'basins', 'couple', 'jade', 'feet', 'hands2', 'scrub', 'hero', 'lounge', 'balinese', 'bamboo', 'kaya', 'reflex', 'facial', 'hands'].map((n, i) => ({ id: 'ug' + i, img: su(n) })),
      places: { 'sundari wellness': { img: su('reception'), area: 'Seminyak', ig: 'sundari.wellness' } }
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

  brand: 'Sangsaka', logo: '/demo-guest/p-sangsaka-logo.png', icon: '/demo-guest/p-sangsaka-icon', first: 'Olivia', tier: 'vip', visits: 7, since: 2025, favourite: 'Sangsaka',
  perks: ['15% off your bill, every visit', 'Welcome cocktail upstairs at DI ATAS', "A chef's snack from the kitchen, on the house", 'Birthday dessert from the wood oven', 'First pick of the private dining room'],
  perkIcons: ['pct', 'cocktail', 'food', 'cake', 'star'],
  reward: { target: 10, text: "Chef's sharing menu for two" },
  venues: [
    { name: 'Sangsaka', area: 'Kerobokan', opens: '17:30', closes: '23:00', wa: SNG_WA, phone: '+62 812 3695 9895', email: 'info@sangsakabali.com', map: SNG_MAP, review: SNG_MAP, book: SNG_BOOK },
    { name: 'DI ATAS', area: 'Rooftop bar upstairs', opens: '19:00', closes: '01:00', wa: SNG_WA, phone: '+62 812 3695 9895', map: SNG_MAP }
  ],
  contact: { wa: SNG_WA, phone: '+62 812 3695 9895', email: 'info@sangsakabali.com', map: SNG_MAP, ig: 'sangsakabali' },
  acts: [
    { title: 'Late night at DI ATAS', line: 'Cocktails on the rooftop until 1am', every: [4, 5, 6], start: '21:00', end: '01:00', venue: 'DI ATAS', ic: 'drinks' }
  ],
  content: today => {
    const y = year(today);
    return {
      others: { on: true, bold: true, list: [{ id: 'luma', name: 'Luma', city: 'Canggu', img: '/demo-guest/p-luma-room.jpg', line: 'Mediterranean, with island flavours', book: 'https://wa.me/6281139414999',
    places: [{ name: 'The restaurant', img: '/demo-guest/p-luma-table.jpg', line: 'Mediterranean plates to share', opens: '12:00', closes: '23:00' },
      { name: 'Bar Luma', img: '/demo-guest/p-luma-wine.jpg', line: 'Terrace bar · Negroni on tap · vinyl DJs at weekends' },
      { name: 'From our kitchen', img: '/demo-guest/p-luma-lamb.jpg', line: 'Southern Europe, Balinese produce' },
      { name: 'The chefs', img: '/demo-guest/p-luma-chefs.jpg', line: 'Cameron Emirali and Kieran Morland' }] }] },
      theme: { top: '#141210', acc: '#CDA86B', pg: '#F5F1EA' }, motion: true, film: 'qCGlNvdXNsc', filmTall: true,
      gift: { on: true, title: "A dinner they'll remember", line: 'A thoughtful present for someone you love. Tell us the amount and who it is for.', to: SNG_WA, amounts: [500000, 1000000, 2000000], max: 5000000, bonus: 10 },
      slides: [
        { id: 'ss1', img: sg('diners'), title: 'Modern Indonesian, with a twist', line: 'Down a back street in Seminyak', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'ss2', img: sg('crab'), title: 'Mud crab glass noodles', line: 'From the clay pot to the table', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
        { id: 'ss3', img: sg('mural'), title: 'Dinner under the Barong', line: 'Wood-fired plates to share', venue: 'Sangsaka', btn: 'book', url: SNG_BOOK },
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
        'sangsaka': { img: sg('room'), area: 'Kerobokan', ig: 'sangsakabali', menus: [{ name: 'Food', pages: ['food-1', 'food-2', 'food-3'].map(SNG_MENU) }, { name: 'Wine', pages: ['wine-1', 'wine-2', 'wine-3'].map(SNG_MENU) }] },
        'di atas': { img: sg('bordeaux'), area: 'Rooftop bar upstairs', ig: 'sangsakabali', menus: [{ name: 'Cocktails', pages: ['cocktails'].map(SNG_MENU) }, { name: 'Wine', pages: ['wine-1', 'wine-2', 'wine-3'].map(SNG_MENU) }] }
      }
    };
  }
};

const MS_BOOK = 'https://www.sevenrooms.com/explore/masonryrestaurantcanggu/reservations/create/search/';
const MS_WA = '6285792505028';
const ms = n => '/demo-guest/p-masonry-' + n + '.jpg';
P.masonry = {
  brand: 'Masonry', logo: '/demo-guest/p-masonry-logo.png', icon: '/demo-guest/p-masonry-icon', first: 'James', tier: 'vip', visits: 9, since: 2024, favourite: 'Masonry Canggu',
  perks: ['10% off your bill at every Masonry', 'A Masonry Old Fashioned on arrival', 'House charcuterie for the table, on us', 'Birthday dessert from the wood oven', 'Priority bookings at all three venues'],
  perkIcons: ['pct', 'cocktail', 'food', 'cake', 'star'],
  reward: { target: 10, text: '48-hour short rib dinner for two' },
  venues: [
    { name: 'Masonry Canggu', area: 'Batu Bolong, Canggu', opens: '12:00', closes: '00:00', wa: MS_WA, phone: '+62 857 9250 5028', book: MS_BOOK },
    { name: 'Masonry Uluwatu', area: 'Uluwatu', phone: '+62 821 4676 5177' },
    { name: 'Bar Vera', area: 'Pererenan · Further Hotel', phone: '+62 823 4271 3110' }
  ],
  contact: { wa: MS_WA, phone: '+62 857 9250 5028' },
  acts: [
    { title: 'Fire on the grill', line: 'Everything cooked over wood and coals', every: [0, 1, 2, 3, 4, 5, 6], start: '12:00', end: '00:00', venue: 'Masonry Canggu', ic: 'food' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#1C1B19', acc: '#C8823F', pg: '#F3EFE8' },
      gift: { on: true, title: 'Dinner by the fire', line: 'Give someone a night at Masonry. Tell us the amount and who it is for.', to: MS_WA, amounts: [500000, 1000000, 2000000], max: 5000000, bonus: 10 },
      slides: [
        { id: 'ms1', img: ms('window'), title: 'Good food cooked over fire', line: 'Stiff drinks, open windows, Batu Bolong', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'ms2', img: ms('beef'), title: '48-hour slow roasted short rib', line: 'Chimichurri, roasted shallots', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'ms3', img: ms('fire'), title: 'Everything over wood and coals', line: 'Made from scratch, every day', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'ms4', img: ms('backroom'), title: 'The Backroom', line: 'Leather booths, a pool table and a late bar', venue: 'Masonry Canggu', btn: 'wa' },
        { id: 'ms5', img: ms('u-scallop'), title: 'Masonry Uluwatu', line: 'The same fire, down south', venue: 'Masonry Uluwatu', btn: 'wa' },
        { id: 'ms6', img: ms('v-room'), title: 'Bar Vera', line: 'Bistro and wine bar in Pererenan', venue: 'Bar Vera', btn: 'wa' }
      ],
      deals: [
        { id: 'md1', img: ms('negroni'), title: 'Members: 2 for 1 Old Fashioned', when: 'Daily · 5–7pm', venue: 'Masonry Canggu' },
        { id: 'md2', img: ms('c-charcuterie'), title: 'House charcuterie board · Rp 195k', when: 'Mon–Fri · 12–4pm', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'md3', img: ms('v-martini'), title: 'Martini hour at Bar Vera', when: 'Daily · 5–7pm', venue: 'Bar Vera' },
        { id: 'md4', img: ms('j-wine'), title: 'Members: 15% off any bottle', when: 'Every night', venue: 'Masonry Canggu' }
      ],
      events: [
        { id: 'me1', img: ms('c-spread'), title: 'Chef’s table by the fire', line: 'Five courses, one night only', date: addDays(today, 8), time: '18:30', time2: '23:00', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK, hl: true,
          details: 'A five-course menu cooked over wood and coals, with paired wines.', price: 'Set menu, paired wines available', notes: 'Members get first pick of tables.' },
        { id: 'me2', img: ms('backroom'), title: 'Backroom sessions', line: 'DJ, cocktails and the pool table', date: addDays(today, 3), time: '21:00', time2: '01:00', venue: 'Masonry Canggu', btn: 'wa',
          details: 'A DJ in the Backroom, the bar open late.' },
        { id: 'me3', img: ms('c-yorkshire'), title: 'Christmas long lunch', line: 'Roasts from the fire, all the trimmings', date: y + '-12-25', time: '12:00', time2: '17:00', venue: 'Masonry Canggu', btn: 'book', url: MS_BOOK },
        { id: 'me4', img: ms('v-room'), title: "New Year's Eve", line: 'Dinner, then the party', date: y + '-12-31', time: '18:00', time2: '01:00', venue: 'Bar Vera', btn: 'wa' }
      ],
      gallery: ['window', 'beef', 'fire', 'backroom', 'c-spread', 'negroni', 'oven', 'lobster', 'terrace', 'c-cocktails', 'tartare', 'room', 'c-flatbread', 'drinks', 'c-charcuterie', 'u-scallop', 'u-cabbage', 'u-rolls', 'u-chablis', 'v-room', 'v-martini', 'v-bouillabaisse', 'v-grouper', 'v-cognac']
        .map((n, i) => ({ id: 'mg' + i, img: ms(n), venue: n.startsWith('u-') ? 'Masonry Uluwatu' : n.startsWith('v-') ? 'Bar Vera' : 'Masonry Canggu' })),
      places: {
        'masonry canggu': { img: ms('window'), area: 'Batu Bolong, Canggu' },
        'masonry uluwatu': { img: ms('u-scallop'), area: 'Uluwatu' },
        'bar vera': { img: ms('v-room'), area: 'Pererenan · Further Hotel' }
      }
    };
  }
};

const CODES = { K8SNGA: 'sangsaka', B6PADL: 'bpa', S8HLTR: 'shelter', T7RNSB: 'trans', '5NKGZJ': 'trans', S4DK7R: 'sundari', M3SNRY: 'masonry', L5UMAB: 'sangsaka' };   // L5UMAB = Luma keyring: same owners, opens the Sangsaka app   // 5NKGZJ = the printed sample card, shown as Trans for the GM demo
// Mavis Club network: each of the guest's other venues as a logo tile (their colour, logo, how long they've been a member there)
const KEY_CODE = { sangsaka: 'K8SNGA', bpa: 'B6PADL', shelter: 'S8HLTR', trans: 'T7RNSB', sundari: 'S4DK7R', masonry: 'M3SNRY' };
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
