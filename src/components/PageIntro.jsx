import React from 'react';

export function PageIntro({ eyebrow, title, description, mark, className = '' }) {
  return (
    <section className={`page-intro page-intro--marked ${className}`}>
      <div className="page-intro-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="page-intro-mark" aria-hidden="true">
        {mark}
      </div>
    </section>
  );
}
