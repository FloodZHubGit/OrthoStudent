import { Preferences } from '@capacitor/preferences';

const PROMO_KEY = 'promo';
const CACHE_PREFIX = 'planning:';

export async function getPromo() {
  const { value } = await Preferences.get({ key: PROMO_KEY });
  return value ? Number(value) : null;
}

export function setPromo(annee) {
  return Preferences.set({ key: PROMO_KEY, value: String(annee) });
}

export async function getPlanning(annee) {
  const { value } = await Preferences.get({ key: CACHE_PREFIX + annee });
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

export function setPlanning(annee, planning) {
  return Preferences.set({ key: CACHE_PREFIX + annee, value: JSON.stringify(planning) });
}
