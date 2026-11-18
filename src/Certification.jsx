import React from 'react';
import { Award, ArrowUpRight, Check } from 'lucide-react';
import './certification.css';

export default function Certification() {
  return <article className="certification" aria-labelledby="black-belt-title">
    <div className="certification-emblem" aria-hidden="true"><Award size={45} strokeWidth={1.2}/><span>BLACK BELT</span><i/></div>
    <div className="certification-copy">
      <span className="certification-kicker">JOHNSON & JOHNSON / PROFESSIONAL CERTIFICATION</span>
      <h3 id="black-belt-title">Design Excellence <span>Black Belt</span></h3>
      <p>Recognized for completing Johnson & Johnson Continuous Improvement requirements for Design Excellence Black Belt certification.</p>
      <div className="certification-meta"><span><Check size={13} aria-hidden="true"/> Awarded June 2025</span><span>Nwachukwu David Ibekwe</span></div>
    </div>
    <a className="certification-link" href="/certifications/nwachukwu-ibekwe-design-excellence-black-belt.pdf" target="_blank" rel="noreferrer">View certificate <ArrowUpRight size={17} aria-hidden="true"/><span className="certification-format">PDF · Opens in a new tab</span></a>
  </article>;
}
