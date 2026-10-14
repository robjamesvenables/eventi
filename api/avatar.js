// A person's photo for Chat notifications.
//   GET /api/avatar?p=<profile id>&s=<signature>
// The signature is made by the server when it sends the notification, so the address can't be guessed
// or changed to someone else's id. Returns the photo as an image, or 404 if they don't have one.
const crypto = require('crypto');
const L = require('./_lib');

function sign(id){ return crypto.createHmac('sha256', L.SERVICE_KEY || 'x').update('avatar:' + id).digest('hex').slice(0, 24); }

module.exports = async (req, res) => {
  try {
    const id = String((req.query && req.query.p) || '');
    const s = String((req.query && req.query.s) || '');
    if (!id || !L.SERVICE_KEY || s.length !== 24 || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(sign(id)))) { res.status(404).end(); return; }
    const p = (await L.db('profiles?select=photo,active&id=eq.' + encodeURIComponent(id)))[0];
    const m = p && p.active !== false && /^data:(image\/[a-z+.-]+);base64,(.+)$/i.exec(p.photo || '');
    if (!m) { res.status(404).end(); return; }
    res.setHeader('Content-Type', m[1]);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(Buffer.from(m[2], 'base64'));
  } catch (e) {
    res.status(404).end();
  }
};
module.exports.sign = sign;
