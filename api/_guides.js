// Guest guides: the free hotel guide anyone gets from the room / menu QR (app.getmavis.co/g/<slug>). No login, nothing to type.
// "Got a keyring?" on the guide scans the guest's member keyring; this phone then opens their member page (/k/CODE) from the same QR.
// One entry per venue with the guest option switched on (hotels yes, restaurants and bars members-only by default).
const tr = n => '/demo-guest/p-trans-' + n + '.jpg';
const G = {};
G.trans = {
  brand: 'The Trans Resort Bali', logo: '/demo-guest/p-trans-logo.png', member: 'T7RNSB',   // member: whose activities show under "Today" (same as the member page)
  theme: { top: '#7A1F1F', acc: '#C9A24A', pg: '#F7F3EC' },
  title: 'Welcome to<br>The Trans Resort', sub: 'Everything for your stay, in one place.',
  geo: { lat: -8.6905, lon: 115.1652 },   // live weather and sunset
  phone: '+62 361 898 1234', wa: '6281138201212',
  // Featured at the top: what the hotel is pushing (every: days of the week, 0 = Sunday; on those days it says Tonight)
  feature: { img: tr('bbq'), title: 'Rooftop BBQ', where: 'The 18th Rooftop Bar', every: [5], price: 'IDR 400,000', ask: 'Book on WhatsApp' },
  // What's on: events and activities (date: hidden once it's passed; noteUntil: the note goes after that day)
  events: [
    { img: tr('xmas'), title: 'Christmas Across Asia', line: 'Festive buffet, live choir, Santa and a kids\' corner', date: '2026-12-25', time: '12:30 – 3:30pm', where: 'The Grand Ballroom',
      price: 'IDR 1,000,000++ per person\nIDR 350,000++ per child', note: '20% off when you book by 15 December', noteUntil: '2026-12-15', ask: 'Book on WhatsApp' },
    { img: tr('braids'), title: 'Hair braiding for kids', line: 'Colourful braids at The Kids\' Club', price: 'From IDR 450,000',
      book: 'Book ahead at The Kids\' Club or Front Office, or press the star key on your room phone' }
  ],
  // Plan an event: the sales section. Each one asks the date + guest count, then opens WhatsApp to the events team (wa; empty = the hotel's main WhatsApp)
  plan: { label: 'Plan an event with us', wa: '',
    hero: { img: tr('wedding'), tag: 'Weddings', title: 'Your wedding at The Trans', line: 'Ballroom, rooftop and garden weddings, planned with you by our wedding team', btn: 'Talk to our wedding team', what: 'a wedding', sheet: 'Plan your wedding' },
    kinds: [
      { img: tr('ballroom'), title: 'Corporate & meetings', line: 'Ballroom, meeting rooms, team dinners', what: 'a corporate event', sheet: 'Plan your corporate event' },
      { img: tr('18lounge'), title: 'Birthday party', line: 'Rooftop or private dining', what: 'a birthday party', sheet: 'Plan your birthday party' },
      { img: tr('kids'), title: "Kids' party", line: "Games, cake and The Kids' Club", what: "a kids' party", sheet: "Plan your kids' party" },
      { img: tr('18couple'), title: 'Anniversary', line: 'A private table for two', what: 'an anniversary', sheet: 'Plan your anniversary' },
      { img: tr('courtyard'), title: 'Family gathering', line: 'Reunions and get-togethers', what: 'a family gathering', sheet: 'Plan your family gathering' },
      { title: 'Something else', line: 'Tell us what you have in mind', what: 'an event', sheet: 'Plan your event' }
    ],
    guests: ['Under 20', '20 – 50', '50 – 100', '100 – 300', '300+'] },
  // Open today: the tiles. Tap one for its own page (photo, hours, what's there, offers, ask button).
  open: [
    { name: 'Beach Pool', img: tr('pool'), opens: '07:00', closes: '19:00', title: 'White Sandy Beach Pool', line: 'Family beach pool',
      chips: ['Imported Australian sand', "Kids' pool", 'Waterslide', 'Poolside loungers'] },
    { name: "Kids' Club", img: tr('kids'), opens: '09:00', closes: '17:00', title: "The Kids' Club", ev: 1,
      chips: ['Arts & crafts', 'Indoor playground', "Children's library", 'Multimedia games', 'Air hockey'] },
    { name: 'Fitness Center', img: tr('gym'), opens: '06:00', closes: '19:00', title: 'The Fitness Center',
      chips: ['Life Fitness equipment', 'Personal training', 'Yoga rooms', 'Sauna', 'Steam room', 'Whirlpool'],
      mem: { label: 'Live in Bali? Gym membership', price: 'IDR 1,000,000++', unit: 'per person', wa: '',   // wa: the gym's own WhatsApp (button shows once it's set)
        items: [{ ic: 'gym', text: 'Gym (Life Fitness) and yoga rooms' }, { ic: 'steam', text: 'Steam room, sauna, plunge pool and whirlpool' }, { ic: 'swim', text: 'Main pool, free towels, free parking' },
          { ic: 'food', hl: '20% off', text: 'restaurants and bars' }, { ic: 'leaf', hl: '20% off', text: 'The Spa' }] } },
    { name: 'The Spa', img: tr('spa'), opens: '09:00', closes: '21:00', title: 'The Spa', offer: 0, ask: 'Book on WhatsApp' }   // offer: shows that leisure offer inside
  ],
  offers: [
    { img: tr('spaoffer'), title: 'A Private Celebration of Love', line: 'Rose-petal Jacuzzi at The Spa', price: 'IDR 4,000,000++ per couple' },
    { img: tr('studio'), title: 'Trans Studio Bali', line: '16+ rides, 4 shows, 5 zones', price: 'Save up to 30% on tickets' }
  ],
  cards: [
    { label: 'Resort activities', img: tr('yoga'), pos: '50% 85%', title: 'Things to do', chips: ['Mini golf', 'Pool games', 'Aerobics', 'Cooking experiences', 'Table tennis', 'Outdoor movie nights'], ask: 'Ask reception on WhatsApp' }
  ],
  more: [
    { ic: 'van', title: 'Shuttle service', line: 'To Potato Head and Seminyak Square', act: 'call' },
    { ic: 'bag', title: 'ARSA Boutique', line: 'Indonesian crafts, textiles and gifts', opens: '09:00', closes: '21:00' },
    { ic: 'heart', title: 'Partner privileges', line: 'Guest offers at dining venues and attractions' },
    { ic: 'boat', title: 'The Trans Luxury Yacht', line: 'Private charter · 2 suites, 8 cabins, up to 20 guests' }
  ]
};
module.exports = { get: slug => G[String(slug || '').toLowerCase()] || null };
