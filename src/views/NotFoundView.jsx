import React from 'react';

export function NotFoundView({ navigate }) {
  return <div className="page"><section className="page-intro"><p className="eyebrow">LEÇON INTROUVABLE</p><h1>Cette leçon n’existe pas.</h1><p>Retourne au parcours pour choisir une leçon disponible.</p><button className="primary-btn" onClick={() => navigate('roadmap')}>Voir le parcours</button></section></div>;
}
