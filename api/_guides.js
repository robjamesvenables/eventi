// Guest guides: the free hotel guide anyone gets from the room / menu QR (app.getmavis.co/g/<slug>). No login, nothing to type.
// "Got a keyring?" on the guide scans the guest's member keyring; this phone then opens their member page (/k/CODE) from the same QR.
// One entry per venue with the guest option switched on (hotels yes, restaurants and bars members-only by default).
const tr = n => '/demo-guest/p-trans-' + n + '.jpg';
const G = {};
G.trans = {
  brand: 'The Trans Resort Bali', logo: '/demo-guest/p-trans-logo.png', icon: '/demo-guest/p-trans-icon',   // icon: the hotel's own tab / home-screen / link-preview icon (-192.png and -512.png)
  member: 'T7RNSB',   // member: whose activities show under "Today" (same as the member page)
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
// The Trans Luxury Hotel Surabaya (19 Nov): photo tiles at the top, a lift-style floor guide, no keyring box (the members app is sold separately)
const s2 = n => '/demo-guest/p-sby2-' + n + '.jpg', s3 = n => '/demo-guest/p-sby3-' + n + '.jpg';
G.surabaya = {
  brand: 'The Trans Luxury Hotel Surabaya', logo: '/demo-guest/p-sby-logo-w.png', icon: '/demo-guest/p-sby-icon',
  member: 'T6RSBY', nokey: true, short: 'The Trans Surabaya',
  theme: { top: '#1C1C1E', acc: '#C9A96E', pg: '#ECE9E4' },
  title: 'Welcome to<br>The Trans Surabaya', sub: 'Everything for your stay, one tap away.',
  geo: { lat: -7.3389, lon: 112.7303 },
  phone: '+62 31 3000 8888', wa: '6281118888055',
  // tiles: photo buttons at the top. go: a place page (open:<n>), a section (#id), or wa (ask us)
  tiles: [
    { label: 'Sky Beach Club', ic: 'umb', img: s2('pool-day'), go: 'open:0' }, { label: 'Sky Lounge', ic: 'wine', img: '/demo-guest/p-sby-skylounge.jpg', go: 'open:1' }, { label: 'Grand Restaurant', ic: 'food', img: s3('grand-chandelier'), go: 'open:2' },
    { label: 'The Lounge', ic: 'cup', img: s3('lounge'), go: 'open:3' }, { label: 'Spa', ic: 'leaf', img: s3('spa'), go: 'open:4' }, { label: 'Sauna & steam', ic: 'steam', img: s3('wet'), go: 'open:5' },
    { label: 'Gym', ic: 'gym', img: s3('gym'), go: 'open:6' }, { label: 'Beauty Salon', ic: 'scis', img: s3('salon'), go: 'open:7' }, { label: 'Kids Club', ic: 'smile', img: s3('kids'), go: 'open:8' },
    { label: "What's on", ic: 'cal', img: s2('fireworks'), go: '#whatson' }, { label: 'Snow World', ic: 'snow', img: s3('snowworld'), go: '#nearby' }, { label: 'Ask us', ic: 'chat', img: s3('lounge-stair'), go: 'wa' }
  ],
  // floors: the lift panel (demo levels)
  floors: [
    { lv: '28', title: '28th Sky Beach Club', line: 'Infinity pool · sunbeds · sunset bar' },
    { lv: '27', title: 'The 27th Sky Lounge & Bistro', line: 'Sky dining over the city' },
    { lv: '8', title: 'The Spa · Sauna & steam · Gym', line: 'Treatments, steam room, sauna, jacuzzi, fitness' },
    { lv: '7', title: 'Beauty Salon', line: 'Irwan Team Hair Design' },
    { lv: '6', title: 'Grand & Iconic Ballrooms', line: 'Weddings and celebrations' },
    { lv: '2–5', title: 'Boardrooms', line: 'Meetings and private events' },
    { lv: '1', title: 'Grand Restaurant', line: 'Breakfast and international buffet' },
    { lv: 'G', title: 'Lobby · The Lounge · Kids Club', line: 'Coffee, afternoon tea · walk to Trans Icon Mall' }
  ],
  events: [
    { img: s2('fireworks'), title: 'Fireworks Party & BBQ Dinner', line: 'Count down to midnight with DJ Katty Butterfly', date: '2026-12-31', time: '8pm – 1am', where: '28th Sky Beach Club', price: 'IDR 999,000++ per person', ask: 'Book on WhatsApp' },
    { img: s2('takehome'), title: 'Christmas Dinner & Brunch', line: 'Christmas Eve dinner, Christmas Day brunch and dinner', date: '2026-12-24', time: '6 – 9pm', where: 'Grand Restaurant', price: 'IDR 588,000++ per person', note: 'Early bird 30% off until 10 December', noteUntil: '2026-12-10', ask: 'Book on WhatsApp' },
    { img: s2('xmas-sky'), title: 'Christmas Dinner at the Sky Beach Club', line: 'Indoors on the 27th level', date: '2026-12-25', time: 'From 6pm', where: '28th Sky Beach Club', price: 'From IDR 488,000++ per person', ask: 'Book on WhatsApp' },
    { img: s2('nye-table'), title: "The New Year's Table", line: 'Buffet, seafood, carvery and the countdown', date: '2026-12-31', time: '7pm – midnight', where: 'Grand Restaurant', price: 'IDR 628,000++ per person', note: '20% off when you book by 30 November', noteUntil: '2026-11-30', ask: 'Book on WhatsApp' },
    { img: s2('gift-lunch'), title: 'Christmas Gift Exchange Lunch', line: 'Lunch daily, 1 to 30 December', where: 'Grand Restaurant', price: 'IDR 488,000++ per person · buy 1 get 1 free', ask: 'Book on WhatsApp' }
  ],
  plan: { label: 'Plan an event with us', wa: '',
    hero: { img: s2('wedding-aisle'), tag: 'Weddings', title: 'Your wedding at The Trans', line: 'From intimate ceremonies to the Grand Ballroom', btn: 'Talk to our wedding team', what: 'a wedding', sheet: 'Plan your wedding' },
    kinds: [
      { img: s3('boardroom'), title: 'Corporate & meetings', line: 'Boardrooms on levels 2 to 5', what: 'a corporate event', sheet: 'Plan your corporate event' },
      { img: s3('iconic-ballroom'), title: 'Celebrations', line: 'The Iconic Ballroom, skyline views', what: 'a celebration', sheet: 'Plan your celebration' },
      { img: s3('ballroom-wedding'), title: 'Gala dinner', line: 'The Grand Ballroom', what: 'a gala dinner', sheet: 'Plan your gala dinner' },
      { img: '/demo-guest/p-sby-skylounge.jpg', title: 'Birthday dinner', line: 'At the 27th Sky Lounge', what: 'a birthday dinner', sheet: 'Plan your birthday dinner' },
      { img: s3('kids'), title: "Kids' party", line: 'Games, cake and the Kids Club', what: "a kids' party", sheet: "Plan your kids' party" },
      { title: 'Something else', line: 'Tell us what you have in mind', what: 'an event', sheet: 'Plan your event' }
    ],
    guests: ['Under 20', '20 – 50', '50 – 100', '100 – 300', '300+'] },
  // open: each tile's own page (photo, hours, what's there)
  open: [
    { name: 'Sky Beach Club', img: s2('pool-day'), opens: '12:00', closes: '00:00', title: '28th Sky Beach Club', line: 'The highest beach club in Indonesia, a resort-style escape above the city', chips: ['Infinity pool', 'Sunbeds', 'Sunset bar', 'Level 28'], ask: 'Book a sunbed' },
    { name: 'Sky Lounge', img: '/demo-guest/p-sby-skylounge.jpg', opens: '12:00', closes: '00:00', title: 'The 27th Sky Lounge & Bistro', line: 'Crafted cuisine and refined conversations above the Surabaya skyline', chips: ['Sky dining', 'City views', 'Level 27'], ask: 'Book a table' },
    { name: 'Grand Restaurant', img: s3('grand-chandelier'), title: 'Grand Restaurant', line: 'International and Asian cuisine, inspired by the seasons', chips: ['Breakfast', 'Buffet', 'Level 1'], ask: 'Book a table' },
    { name: 'The Lounge', img: s3('lounge'), title: 'The Lounge', line: 'Artisanal coffee, light bites and curated refreshments at the heart of the hotel', chips: ['Coffee', 'Afternoon tea 3–5pm', 'Ground floor'] },
    { name: 'Spa', img: s3('spa'), opens: '10:00', closes: '22:00', title: 'The Spa', line: "Rejuvenating treatments to relax, unwind and restore balance", chips: ['3 treatment rooms', "Couple's room", 'Level 8'], link: { label: 'See treatments', url: 'https://online.fliphtml5.com/TLHSurabaya/The-SPA-Booklet/' }, ask: 'Book a treatment' },
    { name: 'Sauna & steam', img: s3('wet'), opens: '06:00', closes: '22:00', title: 'Wet Relaxation Areas', line: 'Slow down, release tension and reset your senses', chips: ['Steam room', 'Sauna', 'Jacuzzi', 'Level 8'] },
    { name: 'Gym', img: s3('gym'), opens: '06:00', closes: '22:00', title: 'Fitness & Movement Zone', line: 'Strength training, Pilates, yoga and mobility, with views over the city', chips: ['Strength', 'Pilates', 'Yoga', 'Level 8'] },
    { name: 'Beauty Salon', img: s3('salon'), opens: '10:00', closes: '22:00', title: 'Beauty Salon', line: "With Irwan Team Hair Design, Jakarta's pioneering salon", chips: ['Hair', 'Colouring', 'Beauty', 'Nails', 'Level 7'], ask: 'Book an appointment' },
    { name: 'Kids Club', img: s3('kids'), opens: '08:00', closes: '20:00', title: 'Kids Club', line: 'Creativity and adventure in every moment', chips: ['Soft play', 'Ball pit', 'Games', 'Ground floor'] }
  ],
  offers: [
    { img: s2('hampers'), title: 'Festive hampers', line: 'Cookies, chocolates and coffee in a Trans gift box', price: '20% off until 10 December' },
    { img: s2('takehome'), title: 'A Feast to Take Home', line: 'Christmas dishes for your own table', price: 'From IDR 388,000++' }
  ],
  // nearby: photo cards, then a short list of further trips
  nearby: [
    { img: s3('snowworld'), title: 'Trans Snow World', line: 'Indoor snow park · 1 min walk' },
    { img: s3('mall'), title: 'Trans Icon Mall', line: 'Shopping and dining · 1 min walk' }
  ],
  trips: [['Surabaya Zoo', '10–15 min drive'], ['Kota Lama Surabaya', '18–25 min drive'], ['Tugu Pahlawan', '25 min drive']]
};
module.exports = { get: slug => G[String(slug || '').toLowerCase()] || null };
