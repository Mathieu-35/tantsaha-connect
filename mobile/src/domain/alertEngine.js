// MOTEUR D'ALERTES : fonction pure (pas d'écran, pas de base, pas de réseau).
// On lui donne le calendrier, la date et la météo ; il répond avec la liste des alertes.
// Comme il ne dépend de rien, il se teste facilement (voir alertEngine.test.js).

// Heure d'envoi des notifications (07:00, le matin)
export const NOTIFY_HOUR = 7;
export const NOTIFY_MINUTE = 0;

// "2026-11-07" à partir d'une Date (heure locale)
export function toIsoDate(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

// Le mois est-il dans la période ? Gère le passage d'une année à l'autre (ex. nov → févr).
export function isMonthInRange(month, start, end) {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

// Alertes à afficher AUJOURD'HUI.
// calendars : [{ cropId, sowStartMonth, sowEndMonth, harvestStartMonth, harvestEndMonth }]
// weatherDays : [{ date: '2026-11-07', icon: 'STORM' }, ...]
export function computeAlerts({ calendars, today, weatherDays = [] }) {
  const month = today.getMonth() + 1;
  const todayIso = toIsoDate(today);
  const alerts = [];

  for (const day of weatherDays) {
    if (day.icon === 'STORM' && day.date >= todayIso) {
      alerts.push({ kind: 'STORM', date: day.date });
    }
  }

  for (const c of calendars) {
    if (isMonthInRange(month, c.sowStartMonth, c.sowEndMonth)) {
      alerts.push({ kind: 'SOW', cropId: c.cropId, startMonth: c.sowStartMonth, endMonth: c.sowEndMonth });
    }
    if (isMonthInRange(month, c.harvestStartMonth, c.harvestEndMonth)) {
      alerts.push({ kind: 'HARVEST', cropId: c.cropId, startMonth: c.harvestStartMonth, endMonth: c.harvestEndMonth });
    }
  }

  return alerts;
}

function atNotifyTime(year, monthIndex, day) {
  return new Date(year, monthIndex, day, NOTIFY_HOUR, NOTIFY_MINUTE, 0, 0);
}

// Prochaine fois où l'on pourra notifier : aujourd'hui à 07:00 si pas passé, sinon demain.
function nextNotifyMoment(now) {
  const todayMoment = atNotifyTime(now.getFullYear(), now.getMonth(), now.getDate());
  if (todayMoment > now) return todayMoment;
  return atNotifyTime(now.getFullYear(), now.getMonth(), now.getDate() + 1);
}

// Premier jour du prochain mois de départ (cette année, ou l'an prochain si déjà passé)
function nextStartMoment(startMonth, now) {
  const thisYear = atNotifyTime(now.getFullYear(), startMonth - 1, 1);
  if (thisYear > now) return thisYear;
  return atNotifyTime(now.getFullYear() + 1, startMonth - 1, 1);
}

// Notifications à programmer sur le téléphone : [{ kind, cropId?, at: Date }]
//  - période en cours  → une notification au prochain 07:00
//  - période à venir   → une notification le 1er jour du mois de début, à 07:00
//  - orage annoncé     → le jour de l'orage à 07:00 (ignoré si 07:00 est déjà passé)
export function planNotifications({ calendars, now, weatherDays = [] }) {
  const month = now.getMonth() + 1;
  const plan = [];

  for (const c of calendars) {
    const periods = [
      { kind: 'SOW', start: c.sowStartMonth, end: c.sowEndMonth },
      { kind: 'HARVEST', start: c.harvestStartMonth, end: c.harvestEndMonth },
    ];
    for (const p of periods) {
      const at = isMonthInRange(month, p.start, p.end) ? nextNotifyMoment(now) : nextStartMoment(p.start, now);
      plan.push({ kind: p.kind, cropId: c.cropId, at });
    }
  }

  const seenStormDays = new Set();
  for (const day of weatherDays) {
    if (day.icon !== 'STORM' || seenStormDays.has(day.date)) continue;
    const [y, m, d] = day.date.split('-').map(Number);
    const at = atNotifyTime(y, m - 1, d);
    if (at > now) {
      seenStormDays.add(day.date);
      plan.push({ kind: 'STORM', date: day.date, at });
    }
  }

  return plan.sort((a, b) => a.at - b.at);
}
