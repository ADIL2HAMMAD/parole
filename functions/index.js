import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();

const ACADEMY_SOURCE = {
  name: 'Académie française — Questions de langue',
  url: 'https://www.academie-francaise.fr/questions-de-langue',
};

const stripHtml = (value) => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/&(?:nbsp|#160);/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&(?:#39|apos);/gi, '’')
  .replace(/\s+/g, ' ')
  .trim();

function extractTopics(html) {
  const topics = [];
  const seen = new Set();
  const headingPattern = /<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi;
  for (const match of html.matchAll(headingPattern)) {
    const title = stripHtml(match[1]);
    if (title.length < 4 || title.length > 120 || seen.has(title)) continue;
    seen.add(title);
    topics.push({
      title,
      sourceName: ACADEMY_SOURCE.name,
      sourceUrl: ACADEMY_SOURCE.url,
      url: ACADEMY_SOURCE.url,
    });
    if (topics.length === 6) break;
  }
  return topics;
}

async function fetchAcademyTopics() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(ACADEMY_SOURCE.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Parole-language-learning/1.0 (content refresh)' },
    });
    if (!response.ok) throw new Error(`Academy request failed (${response.status})`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) throw new Error('Academy response was not HTML');
    const topics = extractTopics(await response.text());
    if (topics.length < 2) throw new Error('No usable language topics found');
    return topics;
  } finally {
    clearTimeout(timeout);
  }
}

// Monday 08:15 Europe/Paris. The previous successful set stays published if
// the remote source is down or changes its markup unexpectedly.
export const refreshLanguageSources = onSchedule({
  schedule: '15 8 * * 1',
  timeZone: 'Europe/Paris',
  region: 'europe-west1',
  retryCount: 2,
}, async () => {
  const contentRef = getFirestore().doc('content/curriculum');
  try {
    const sourceUpdates = await fetchAcademyTopics();
    await contentRef.set({
      schemaVersion: 2,
      sourceUpdates,
      sourceStatus: [{
        name: ACADEMY_SOURCE.name,
        url: ACADEMY_SOURCE.url,
        status: 'ok',
        fetchedAt: new Date().toISOString(),
      }],
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    logger.info('Language source refresh completed', { count: sourceUpdates.length });
  } catch (error) {
    await contentRef.set({
      sourceStatus: [{
        name: ACADEMY_SOURCE.name,
        url: ACADEMY_SOURCE.url,
        status: 'failed',
        fetchedAt: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Unknown refresh error',
      }],
      lastRefreshErrorAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    logger.error('Language source refresh failed; keeping last published content', error);
  }
});
