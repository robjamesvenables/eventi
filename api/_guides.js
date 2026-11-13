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
  feature: { img: tr('rooftop'), title: 'Rooftop BBQ', where: 'The 18th Rooftop Bar', every: [5], price: 'IDR 400,000', ask: 'Book on WhatsApp' },
  // Open today: the tiles. Tap one for its own page (photo, hours, what's there, offers, ask button).
  open: [
    { name: 'Beach Pool', img: tr('pool'), opens: '07:00', closes: '19:00', title: 'White Sandy Beach Pool', line: 'Family beach pool',
      chips: ['Imported Australian sand', "Kids' pool", 'Waterslide', 'Poolside loungers'] },
    { name: "Kids' Club", img: tr('kids'), opens: '09:00', closes: '17:00', title: "The Kids' Club",
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
