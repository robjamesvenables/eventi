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
          { id: 'ps3', img: sh('drink'), title: 'The Sinaloa', line: 'Mezcal, tequila reposado, agave, cucumber', venue: 'Shelter Pererenan' },
          { id: 'ps4', img: sh('coals'), title: 'Charred over the coals, by hand', line: 'Wood fired Middle Eastern & Mediterranean', venue: 'Shelter Uluwatu' }
        ],
        deals: [
          { id: 'pd1', img: sh('drink'), title: 'Mezcal hour · 2 for 1 Sinaloa', when: 'Daily · 5–7pm', venue: 'Shelter Pererenan' },
          { id: 'pd2', img: sh('barra'), title: 'Long lunch · 3 courses Rp 395k', when: 'Mon–Fri · 12–3pm', venue: 'Shelter Pererenan' },
          { id: 'pd3', img: sh('fire'), title: 'Sunday BBQ · sharing feast', when: 'Sundays · from 12pm', venue: 'Shelter Pererenan' }
        ],
        events: [
          { id: 'pe1', img: sh('coals'), title: 'Shelter Sessions Vol. 12', line: 'Guest chef, one night only', date: addDays(today, 9), time: '18:00', time2: '23:00', venue: 'Shelter Pererenan', btn: 'tickets', url: SHELTER_BOOK, hl: true,
            details: 'A guest chef joins the Shelter team at the fire for one night - a set menu cooked over wood, with paired drinks.', price: 'Set menu, paired drinks available', notes: 'Members get first pick of tables.' },
          { id: 'pe2', img: sh('fire'), title: 'Bonfire Sessions', line: 'An intimate fireside night with Charlie Pretet', date: addDays(today, 4), time: '19:00', time2: '23:00', venue: 'Shelter Pererenan', btn: 'book', url: SHELTER_BOOK,
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

const TRANS_BOOK = 'https://www.transresortbali.com/';
const tr = n => '/demo-guest/p-trans-' + n + '.jpg';
P.trans = {
  brand: 'The Trans Resort Bali', logo: '/demo-guest/p-trans-logo.png', first: 'Guest', tier: 'vip', visits: 6, since: 2025, favourite: 'The Trans Resort Bali',
  perks: ['Welcome drink at The 18th Rooftop', 'Late check-out until 2pm, when available', '15% off at the spa', 'Free kids club afternoons'],
  perkIcons: ['cocktail', 'key', 'leaf', 'smile'],
  reward: { target: 10, text: 'One night in a pool villa' },
  venues: [ { name: 'The Trans Resort Bali', area: 'Seminyak', map: 'https://maps.google.com/?q=The+Trans+Resort+Bali', phone: '+62 361 898 1234', review: 'https://maps.google.com/?q=The+Trans+Resort+Bali' } ],
  acts: [
    { title: 'Sunset at The 18th', line: 'Live acoustic on the rooftop', every: [4, 5, 6], start: '17:30', end: '20:30', venue: 'The Trans Resort Bali' },
    { title: 'Kids club pool party', line: 'Games, music and mocktails', every: [0], start: '14:00', end: '16:00', venue: 'The Trans Resort Bali' }
  ],
  content: today => {
    const y = year(today);
    return {
      theme: { top: '#7A1F1F', acc: '#B8923A', pg: '#F7F3EC' },
      slides: [
        { id: 'ts1', img: tr('pool'), title: 'The lagoon pool', line: '80 metres, with its own sand beach', venue: 'The Trans Resort Bali', btn: 'book', url: TRANS_BOOK },
        { id: 'ts2', img: tr('rooftop'), title: 'Sunsets at The 18th', line: 'Rooftop cocktails and tapas', venue: 'The Trans Resort Bali' },
        { id: 'ts3', img: tr('villapool'), title: 'Private pool villas', line: 'Your own garden and pool', venue: 'The Trans Resort Bali', btn: 'book', url: TRANS_BOOK },
        { id: 'ts4', img: tr('spa'), title: 'The spa', line: 'Balinese treatments, members save 15%', venue: 'The Trans Resort Bali' }
      ],
      deals: [
        { id: 'td1', img: tr('rooftop'), title: 'Rooftop happy hour · 2 for 1', when: 'Daily · 5–7pm', venue: 'The Trans Resort Bali' },
        { id: 'td2', img: tr('spa'), title: 'Couples massage · 90 min', when: 'Mon–Thu', venue: 'The Trans Resort Bali' },
        { id: 'td3', img: tr('dining'), title: 'Family brunch · kids eat free', when: 'Sundays · 11am–3pm', venue: 'The Trans Resort Bali' }
      ],
      events: [
        { id: 'te1', img: tr('ballroom'), title: 'Christmas Eve gala dinner', line: 'Live band and a festive buffet', date: y + '-12-24', time: '19:00', time2: '23:00', venue: 'The Trans Resort Bali', btn: 'book', url: TRANS_BOOK, hl: true,
          details: 'A festive buffet in the Grand Ballroom with a live band, carols and Santa for the kids.', dress: 'Smart casual' },
        { id: 'te2', img: tr('rooftop'), title: "New Year's Eve at The 18th", line: 'Fireworks over Seminyak', date: y + '-12-31', time: '20:00', time2: '01:00', venue: 'The Trans Resort Bali', btn: 'book', url: TRANS_BOOK,
          details: 'Count down on the rooftop with a DJ, free-flow packages and fireworks across the skyline.' },
        { id: 'te3', img: tr('wedding'), title: 'Wedding showcase', line: 'Meet our wedding team', date: addDays(today, 10), time: '10:00', time2: '15:00', venue: 'The Trans Resort Bali', btn: 'book', url: TRANS_BOOK }
      ],
      gallery: ['pool', 'beach', 'rooftop', 'villapool', 'villa', 'room', 'balcony', 'spa', 'lobby', 'lounge', 'dining', 'kids', 'ballroom', 'entrance'].map((n, i) => ({ id: 'tg' + i, img: tr(n), venue: 'The Trans Resort Bali' })),
      places: { 'the trans resort bali': { img: tr('pool'), area: 'Seminyak', ig: 'thetransresortbali' } }
    };
  }
};

const CODES = { S8HLTR: 'shelter', T7RNSB: 'trans' };
module.exports = { get: code => P[CODES[code]] || null, nextDow };
