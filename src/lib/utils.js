export function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

export function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function progressLabel(count) {
  return `${count} leçon${count > 1 ? 's' : ''}`;
}

export function todayKey() {
  return new Intl.DateTimeFormat('en-CA').format(new Date());
}
