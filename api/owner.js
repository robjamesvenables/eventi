// Mavis Owner platform - only the Mavis owner account can use any of this.
// POST { action, ... } with the caller's session token.
//  overview                     -> clients (with staff, activity, storage), invoices, settings, errors
//  create   { name, code, first, last, email, price, currency, venues, trial_days, bill_* }
//  update   { company_id, name?, venues_paid?, price?, currency?, status?, trial_ends?, paid_until?, notes?, bill_* }
//  send_login { profile_id }    -> fresh one-time login link for a client's Super Admin
//  settings_save { settings }   -> your business details, bank, QRIS picture
//  invoice_create { company_id, period_label, qty, unit_price, due }
//  invoice_update { id, status?, paid_method?, due? }
//  invoice_delete { id }        (drafts only)
//  errors_clear
const L = require('./_lib');

const BILL_FIELDS = ['bill_attn', 'bill_address', 'bill_email', 'bill_phone'];
const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 200);

async function makeInvite(profileId, createdBy){
  const token = L.newToken();
  await L.db('invites', { method: 'POST', body: { token, profile_id: profileId, created_by: createdBy, expires_at: new Date(Date.now() + 48 * 3600000).toISOString() } });
  return token;
}
async function uniqueUsername(code, first, last){
  const base = [code, L.slug(first), L.slug(last)].filter(Boolean).join('-');
  let name = base, n = 2;
  while ((await L.db('profiles?select=id&username=eq.' + encodeURIComponent(name))).length) { name = base + '-' + n; n++; }
  return name;
}
async function getSettings(){
  const rows = await L.db('owner_settings?select=key,value');
  const s = {}; rows.forEach(r => { s[r.key] = r.value; });
  return s;
}
async function nextInvoiceNumber(){
  const year = new Date().getFullYear();
  const rows = await L.db('owner_settings?select=value&key=eq.invoice_counter');
  const cur = rows[0] && rows[0].value && rows[0].value.year === year ? rows[0].value.n : 0;
  const n = cur + 1;
  await L.db('owner_settings', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: { key: 'invoice_counter', value: { year, n } } });
  return 'MV-' + year + '-' + String(n).padStart(3, '0');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, { ok: false });
  if (!L.SERVICE_KEY) return L.send(res, 503, { ok: false, reason: 'notset' });
  try {
    const me = await L.caller(req);
    if (!me) return L.send(res, 401, { ok: false, reason: 'login' });
    if (!me.is_owner) return L.send(res, 403, { ok: false, reason: 'owner only', message: 'This page is for Mavis only.' });
    const b = L.body(req);

    if (b.action === 'overview') {
      const [companies, profiles, invoices, files, errors, settings, enquiries] = await Promise.all([
        L.db('companies?select=*&order=created_at.asc'),
        L.db('profiles?select=id,company_id,username,first_name,last_name,role,active,user_id,last_login,last_seen,email'),
        L.db('invoices?select=*&order=created_at.desc&limit=500'),
        L.db('shared_files?select=company_id,size_bytes').catch(() => []),
        L.db('app_errors?select=*&order=created_at.desc&limit=200').catch(() => []),
        getSettings(),
        L.db('mavis_enquiries?select=*&order=created_at.desc&limit=300').catch(() => [])
      ]);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const clients = companies.map(c => {
        const people = profiles.filter(p => p.company_id === c.id);
        const active = people.filter(p => p.active !== false);
        const seen = people.map(p => p.last_seen || p.last_login).filter(Boolean).sort().reverse();
        const byRole = {}; active.forEach(p => { byRole[p.role] = (byRole[p.role] || 0) + 1; });
        return {
          id: c.id, code: c.code, name: c.name, logo: c.logo || null, created_at: c.created_at,
          status: c.status || 'active', trial_ends: c.trial_ends, paid_until: c.paid_until,
          venues_paid: c.venues_paid || 1, venues_used: 1, price: Number(c.price || 0), currency: c.currency || 'IDR',
          notes: c.notes || '', bill_attn: c.bill_attn || '', bill_address: c.bill_address || '', bill_email: c.bill_email || '', bill_phone: c.bill_phone || '',
          staff: active.length, by_role: byRole,
          active_today: people.filter(p => (p.last_seen || p.last_login) && new Date(p.last_seen || p.last_login) >= today).length,
          last_active: seen[0] || null,
          storage_bytes: files.filter(f => f.company_id === c.id).reduce((s, f) => s + (Number(f.size_bytes) || 0), 0),
          superadmins: people.filter(p => p.role === 'superadmin').map(p => ({ id: p.id, name: (p.first_name + ' ' + (p.last_name || '')).trim(), username: p.username, email: p.email, active: p.active !== false, has_login: !!p.user_id, last_active: p.last_seen || p.last_login || null })),
          is_mine: c.id === me.company_id
        };
      });
      const safeSettings = Object.assign({}, settings); delete safeSettings.invoice_counter;
      return L.send(res, 200, { ok: true, clients, invoices, errors, enquiries, settings: safeSettings, me: { name: me.first_name } });
    }

    if (b.action === 'create') {
      const code = L.slug(b.code).replace(/-/g, '').slice(0, 12);
      if (!code || !clean(b.name) || !clean(b.first) || !clean(b.email)) return L.send(res, 400, { ok: false, reason: 'missing', message: 'Please fill in the venue name, Company ID, Super Admin first name and email.' });
      if ((await L.db('companies?select=id&code=eq.' + code)).length) return L.send(res, 409, { ok: false, reason: 'code taken', message: 'That Company ID is already used - pick another.' });
      const trialDays = Math.max(0, Math.min(90, parseInt(b.trial_days, 10) || 0));
      const body = {
        code, name: clean(b.name, 60),
        status: trialDays ? 'trial' : 'active',
        trial_ends: trialDays ? new Date(Date.now() + trialDays * 86400000).toISOString().slice(0, 10) : null,
        venues_paid: Math.max(1, parseInt(b.venues, 10) || 1),
        price: Math.max(0, Number(b.price) || 0),
        currency: b.currency === 'USD' ? 'USD' : 'IDR'
      };
      BILL_FIELDS.forEach(k => { if (b[k] !== undefined) body[k] = clean(b[k], 300) || null; });
      const co = (await L.db('companies', { method: 'POST', body }))[0];
      const username = await uniqueUsername(code, b.first, b.last);
      const p = (await L.db('profiles', { method: 'POST', body: { company_id: co.id, username, first_name: clean(b.first, 60), last_name: clean(b.last, 60), role: 'superadmin', email: clean(b.email).toLowerCase() } }))[0];
      const token = await makeInvite(p.id, me.id);
      return L.send(res, 200, { ok: true, company: co, profile: L.publicProfile(p), token });
    }

    if (b.action === 'update') {
      const co = (await L.db('companies?select=*&id=eq.' + encodeURIComponent(b.company_id)))[0];
      if (!co) return L.send(res, 404, { ok: false, reason: 'not found' });
      const patch = {};
      if (b.name !== undefined) { const n = clean(b.name, 60); if (!n) return L.send(res, 400, { ok: false, message: 'Please type a name.' }); patch.name = n; }
      if (b.venues_paid !== undefined) patch.venues_paid = Math.max(1, Math.min(99, parseInt(b.venues_paid, 10) || 1));
      if (b.price !== undefined) patch.price = Math.max(0, Number(b.price) || 0);
      if (b.currency !== undefined) patch.currency = b.currency === 'USD' ? 'USD' : 'IDR';
      if (b.status !== undefined) {
        if (!['active', 'trial', 'paused'].includes(b.status)) return L.send(res, 400, { ok: false, reason: 'bad status' });
        if (b.status === 'paused' && co.id === me.company_id) return L.send(res, 400, { ok: false, message: "You can't pause your own company." });
        patch.status = b.status;
      }
      ['trial_ends', 'paid_until'].forEach(k => { if (b[k] !== undefined) patch[k] = b[k] ? String(b[k]).slice(0, 10) : null; });
      if (b.notes !== undefined) patch.notes = String(b.notes || '').slice(0, 4000);
      BILL_FIELDS.forEach(k => { if (b[k] !== undefined) patch[k] = clean(b[k], 300) || null; });
      const updated = (await L.db('companies?id=eq.' + co.id, { method: 'PATCH', body: patch }))[0];
      return L.send(res, 200, { ok: true, company: updated });
    }

    if (b.action === 'send_login') {
      const target = (await L.db('profiles?select=*&id=eq.' + encodeURIComponent(b.profile_id)))[0];
      if (!target) return L.send(res, 404, { ok: false, reason: 'not found' });
      await L.db('invites?profile_id=eq.' + target.id + '&used_at=is.null', { method: 'DELETE' });
      const token = await makeInvite(target.id, me.id);
      return L.send(res, 200, { ok: true, token, profile: L.publicProfile(target) });
    }

    if (b.action === 'settings_save') {
      const allowed = ['business', 'bank', 'qris'];
      const s = b.settings || {};
      for (const k of allowed) {
        if (s[k] === undefined) continue;
        if (k === 'qris' && s[k] && (typeof s[k] !== 'string' || !s[k].startsWith('data:image/') || s[k].length > 900000)) return L.send(res, 400, { ok: false, message: 'That QRIS picture could not be used - try a smaller one.' });
        await L.db('owner_settings', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: { key: k, value: s[k], updated_at: new Date().toISOString() } });
      }
      return L.send(res, 200, { ok: true, settings: await getSettings() });
    }

    if (b.action === 'invoice_create') {
      const co = (await L.db('companies?select=*&id=eq.' + encodeURIComponent(b.company_id)))[0];
      if (!co) return L.send(res, 404, { ok: false, reason: 'not found' });
      const qty = Math.max(1, parseInt(b.qty, 10) || co.venues_paid || 1);
      const unit = b.unit_price !== undefined ? Math.max(0, Number(b.unit_price) || 0) : Number(co.price || 0);
      const inv = (await L.db('invoices', { method: 'POST', body: {
        number: await nextInvoiceNumber(), company_id: co.id,
        description: clean(b.description, 200) || 'Mavis - monthly subscription',
        period_label: clean(b.period_label, 80), qty, unit_price: unit, currency: co.currency || 'IDR', total: qty * unit,
        issued: new Date().toISOString().slice(0, 10),
        due: b.due ? String(b.due).slice(0, 10) : new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        status: 'draft'
      } }))[0];
      return L.send(res, 200, { ok: true, invoice: inv });
    }

    if (b.action === 'invoice_update') {
      const inv = (await L.db('invoices?select=*&id=eq.' + encodeURIComponent(b.id)))[0];
      if (!inv) return L.send(res, 404, { ok: false, reason: 'not found' });
      const patch = {};
      if (b.status !== undefined) {
        if (!['draft', 'sent', 'paid', 'void'].includes(b.status)) return L.send(res, 400, { ok: false, reason: 'bad status' });
        patch.status = b.status;
        if (b.status === 'sent' && !inv.sent_at) patch.sent_at = new Date().toISOString();
        if (b.status === 'paid') { patch.paid_at = new Date().toISOString(); patch.paid_method = clean(b.paid_method, 40) || null; }
        if (b.status !== 'paid') { patch.paid_at = null; patch.paid_method = null; }
      }
      if (b.due !== undefined) patch.due = b.due ? String(b.due).slice(0, 10) : null;
      if (b.period_label !== undefined) patch.period_label = clean(b.period_label, 80);
      if (b.qty !== undefined || b.unit_price !== undefined) {
        const qty = Math.max(1, parseInt(b.qty !== undefined ? b.qty : inv.qty, 10) || 1);
        const unit = Math.max(0, Number(b.unit_price !== undefined ? b.unit_price : inv.unit_price) || 0);
        Object.assign(patch, { qty, unit_price: unit, total: qty * unit });
      }
      const updated = (await L.db('invoices?id=eq.' + inv.id, { method: 'PATCH', body: patch }))[0];
      // Paying an invoice moves the client's "paid until" forward to the end of that month
      if (patch.status === 'paid') {
        const co = (await L.db('companies?select=paid_until,status&id=eq.' + inv.company_id))[0];
        const base = new Date(Math.max(Date.now(), co && co.paid_until ? new Date(co.paid_until).getTime() : 0));
        const end = new Date(base.getFullYear(), base.getMonth() + (co && co.paid_until && new Date(co.paid_until) >= new Date() ? 1 : 0) + 1, 0);
        const cpatch = { paid_until: end.toISOString().slice(0, 10) };
        if (co && co.status === 'trial') cpatch.status = 'active';
        await L.db('companies?id=eq.' + inv.company_id, { method: 'PATCH', body: cpatch });
      }
      return L.send(res, 200, { ok: true, invoice: updated });
    }

    if (b.action === 'invoice_delete') {
      const inv = (await L.db('invoices?select=status&id=eq.' + encodeURIComponent(b.id)))[0];
      if (!inv) return L.send(res, 404, { ok: false });
      if (inv.status !== 'draft') return L.send(res, 400, { ok: false, message: 'Only drafts can be deleted - mark it as cancelled instead.' });
      await L.db('invoices?id=eq.' + encodeURIComponent(b.id), { method: 'DELETE' });
      return L.send(res, 200, { ok: true });
    }

    if (b.action === 'enquiry_update') {
      const id = parseInt(b.id, 10); if (!id) return L.send(res, 400, { ok: false });
      const patch = {};
      if (['new', 'contacted', 'won', 'notnow'].includes(b.status)) patch.status = b.status;
      if (b.owner_notes !== undefined) patch.owner_notes = String(b.owner_notes || '').slice(0, 2000);
      await L.db('mavis_enquiries?id=eq.' + id, { method: 'PATCH', body: patch });
      return L.send(res, 200, { ok: true });
    }

    if (b.action === 'errors_clear') {
      await L.db('app_errors?id=gt.0', { method: 'DELETE' });
      return L.send(res, 200, { ok: true });
    }

    return L.send(res, 400, { ok: false, reason: 'unknown action' });
  } catch (e) {
    console.error('owner error', e.message);
    return L.send(res, 500, { ok: false, reason: 'error', message: 'Something went wrong - ' + String(e.message || '').slice(0, 160) });
  }
};
