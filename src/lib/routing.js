const VALID_VIEWS = new Set(['home', 'roadmap', 'conjugate', 'grammar', 'write', 'speak', 'week', 'connectors', 'account', 'history']);

export function readRoute() {
  const route = decodeURIComponent(window.location.pathname.replace(/^\/+|\/+$/g, ''));
  if (route.startsWith('lesson/')) return { view: 'lesson', lessonId: route.slice(7) };
  return { view: VALID_VIEWS.has(route) ? route : 'home', lessonId: null };
}
