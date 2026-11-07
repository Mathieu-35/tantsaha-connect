// TESTS du moteur d'alertes. Lancer : cd mobile && node --test src/domain
// Outil de test intégré à Node : rien à installer.

import test from 'node:test';
import assert from 'node:assert/strict';
import { isMonthInRange, computeAlerts, planNotifications, NOTIFY_HOUR } from './alertEngine.js';

const katsaka = { cropId: 'crop_katsaka', sowStartMonth: 10, sowEndMonth: 12, harvestStartMonth: 2, harvestEndMonth: 4 };
const tsaramaso = { cropId: 'crop_tsaramaso', sowStartMonth: 3, sowEndMonth: 5, harvestStartMonth: 7, harvestEndMonth: 8 };
const novembre = new Date(2026, 10, 7, 10, 0); // 7 novembre 2026, 10:00

test('mois dans une période normale', () => {
  assert.equal(isMonthInRange(11, 10, 12), true);
  assert.equal(isMonthInRange(9, 10, 12), false);
});

test('mois dans une période qui passe d\'une année à l\'autre', () => {
  assert.equal(isMonthInRange(12, 11, 2), true);
  assert.equal(isMonthInRange(1, 11, 2), true);
  assert.equal(isMonthInRange(6, 11, 2), false);
});

test('en novembre : semis du katsaka oui, semis du tsaramaso non', () => {
  const alerts = computeAlerts({ calendars: [katsaka, tsaramaso], today: novembre });
  assert.deepEqual(alerts.map((a) => `${a.kind}:${a.cropId}`), ['SOW:crop_katsaka']);
});

test('en mars : récolte du katsaka et semis du tsaramaso', () => {
  const mars = new Date(2027, 2, 15, 10, 0);
  const alerts = computeAlerts({ calendars: [katsaka, tsaramaso], today: mars });
  const labels = alerts.map((a) => `${a.kind}:${a.cropId}`).sort();
  assert.deepEqual(labels, ['HARVEST:crop_katsaka', 'SOW:crop_tsaramaso']);
});

test('orage annoncé : gardé ; orage passé : ignoré', () => {
  const weatherDays = [
    { date: '2026-11-06', icon: 'STORM' },
    { date: '2026-11-09', icon: 'STORM' },
    { date: '2026-11-08', icon: 'RAIN' },
  ];
  const alerts = computeAlerts({ calendars: [], today: novembre, weatherDays });
  assert.deepEqual(alerts, [{ kind: 'STORM', date: '2026-11-09' }]);
});

test('pas de calendrier, pas de météo : aucune alerte', () => {
  assert.deepEqual(computeAlerts({ calendars: [], today: novembre }), []);
});

test('notification : période en cours → demain à 07:00 (car 07:00 est passé)', () => {
  const plan = planNotifications({ calendars: [katsaka], now: novembre });
  const sow = plan.find((p) => p.kind === 'SOW');
  assert.equal(sow.at.getTime(), new Date(2026, 10, 8, NOTIFY_HOUR, 0).getTime());
});

test('notification : période à venir → le 1er du mois de début', () => {
  const plan = planNotifications({ calendars: [katsaka], now: novembre });
  const harvest = plan.find((p) => p.kind === 'HARVEST');
  assert.equal(harvest.at.getTime(), new Date(2027, 1, 1, NOTIFY_HOUR, 0).getTime());
});

test('notification : orage demain → programmée ; orage aujourd\'hui après 07:00 → ignorée', () => {
  const weatherDays = [
    { date: '2026-11-07', icon: 'STORM' },
    { date: '2026-11-08', icon: 'STORM' },
  ];
  const storms = planNotifications({ calendars: [], now: novembre, weatherDays });
  assert.equal(storms.length, 1);
  assert.equal(storms[0].date, '2026-11-08');
});
