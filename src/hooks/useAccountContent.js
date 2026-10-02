import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { contentSchemaVersion, contentSources } from '../contentSources.js';
import { grammarLevels } from '../grammarData.js';
import { stages, writingPrompts, speakingPrompts } from '../data.js';
import { connectorLessons } from '../views/ConnectorsView.jsx';

const normalize = (value) => ({
  schemaVersion: contentSchemaVersion,
  sources: Array.isArray(value?.sources) ? value.sources : contentSources,
  grammarLevels: Array.isArray(value?.grammarLevels) && value.grammarLevels.length ? value.grammarLevels : grammarLevels,
  stages: Array.isArray(value?.stages) && value.stages.length ? value.stages : stages,
  writingPrompts: Array.isArray(value?.writingPrompts) && value.writingPrompts.length ? value.writingPrompts : writingPrompts,
  speakingPrompts: Array.isArray(value?.speakingPrompts) && value.speakingPrompts.length ? value.speakingPrompts : speakingPrompts,
  connectorLessons: Array.isArray(value?.connectorLessons) && value.connectorLessons.length ? value.connectorLessons : connectorLessons,
  sourceUpdates: Array.isArray(value?.sourceUpdates) ? value.sourceUpdates : [],
  sourceStatus: Array.isArray(value?.sourceStatus) ? value.sourceStatus : [],
  updatedAt: value?.updatedAt || null,
});

// The curriculum has a safe built-in fallback. Signed-in learners receive the
// last successful, server-curated refresh from the shared content document.
export function useAccountContent(user, authReady) {
  const [content, setContent] = useState(() => normalize(null));
  const [loading, setLoading] = useState(Boolean(user && db));

  useEffect(() => {
    if (!authReady || !user || !db) {
      setContent(normalize(null));
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const contentRef = doc(db, 'content', 'curriculum');
    return onSnapshot(contentRef, (snapshot) => {
      if (snapshot.exists()) {
        setContent(normalize(snapshot.data()));
        setLoading(false);
        return;
      }
      setContent(normalize(null));
      setLoading(false);
    }, () => setLoading(false));
  }, [user?.uid, authReady]);

  return { content, contentLoading: loading };
}
