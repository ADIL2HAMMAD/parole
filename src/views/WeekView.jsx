import React from 'react';
import { weeklyPlan } from '../data.js';
import { classNames, progressLabel } from '../lib/utils.js';

export function WeekView({ progress, percentage }) {
  const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(new Date());
  return <div className="page"><section className="page-intro"><p className="eyebrow">ROUTINE B1 À C1</p><h1>Ton programme de la semaine</h1><p>Consacre 45 à 60 minutes par jour. Utilise ce rythme comme un repère, puis ajuste-le à ton emploi du temps.</p></section><div className="week-card">{weeklyPlan.map(([day, focus, task]) => <div className={classNames('week-row', day.toLowerCase() === weekday && 'today')} key={day}><span className="day-name">{day}</span><span className="week-focus"><b>{focus}</b><small>{task}</small></span><span className="week-status">{day.toLowerCase() === weekday ? 'Aujourd’hui' : '—'}</span></div>)}</div><section className="progress-summary"><div><p className="eyebrow">TES REPÈRES</p><h2>La régularité avant la perfection</h2><p>Tu as ouvert l’application {progress.activeDays.length} jour{progress.activeDays.length > 1 ? 's' : ''} et terminé {progressLabel(progress.completed.length)}.</p></div><div className="progress-circle" style={{ background: `conic-gradient(#6f9b8b 0 ${percentage}%, #f8faf9 ${percentage}% 100%)` }}><b>{percentage}%</b><span>du parcours</span></div></section></div>;
}
