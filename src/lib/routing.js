const VALID_VIEWS = new Set(['home', 'roadmap', 'conjugate', 'write', 'speak', 'week']);

export function readRoute() {
  const route = decodeURIComponent(window.location.hash.slice(1).replace(/^\/+/, ''));
  if (route.startsWith('lesson/')) return { view: 'lesson', lessonId: route.slice(7) };
  return { view: VALID_VIEWS.has(route) ? route : 'home', lessonId: null };
}
