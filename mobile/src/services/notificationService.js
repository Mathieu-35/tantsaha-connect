// NOTIFICATIONS LOCALES : programmées sur le téléphone, elles sonnent sans internet.
// À chaque appel, on efface tout et on reprogramme d'après le calendrier et la dernière météo.

import * as Notifications from 'expo-notifications';
import { t } from '../i18n/mg';
import { getMeta } from '../db/metaRepository';
import { listCalendars, listCrops } from '../db/referenceRepository';
import { getWeather } from '../db/weatherRepository';
import { planNotifications } from '../domain/alertEngine';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensurePermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (current.canAskAgain === false) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function refreshAlertNotifications() {
  try {
    const regionId = await getMeta('region_id');
    if (!regionId) return { ok: false, reason: 'NO_REGION' };

    if (!(await ensurePermission())) return { ok: false, reason: 'NO_PERMISSION' };

    const [calendars, crops, weather] = await Promise.all([
      listCalendars(regionId),
      listCrops(),
      getWeather(regionId),
    ]);
    const cropNames = Object.fromEntries(crops.map((c) => [c.id, c.name_mg]));
    const plan = planNotifications({ calendars, now: new Date(), weatherDays: weather ? weather.days : [] });

    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const item of plan) {
      const title = `${t.alertEmoji[item.kind]} ${t.alertTitle[item.kind]}`;
      const body = item.kind === 'STORM' ? t.alertStormBody : cropNames[item.cropId] || '';
      await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: item.at },
      });
    }
    return { ok: true, count: plan.length };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
