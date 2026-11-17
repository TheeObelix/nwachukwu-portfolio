import React, { useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import ParticleStudy from './ParticleStudy';
import './project-explorer.css';

const shortNames = ['Robotics', 'Thermal', 'MEMS', 'Self-assembly', 'Graphene', 'Quantum dots', 'Aerogels'];

export default function ProjectExplorer({ projects, onOpen }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const project = projects[selected];
  const select = index => setSelected((index + projects.length) % projects.length);
  return <section className="explorer" id="home" aria-label="Interactive engineering portfolio">
    <div className="explorer-intro">
      <div><span className="explorer-eyebrow">ENGINEER / RESEARCHER / BUILDER</span><h1>Nwachukwu Ibekwe<span>.</span></h1><p>Exploring what comes next.<br/>From robotic systems to materials at the nanoscale.</p></div>
      <a className="explorer-portrait" href="#about"><img src="/headshot.jpg" alt="Nwachukwu Ibekwe" fetchPriority="high"/><span>Meet the engineer <ArrowUpRight size={13}/></span></a>
    </div>
    <div className="explorer-stage">
      <div className="explorer-copy" key={project.id}>
        <span className="explorer-eyebrow">{project.n} / {project.category}</span>
        <h2>{project.title}</h2><p>{project.desc}</p>
        <div className="explorer-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <button className="explorer-open" onClick={() => onOpen(project)}>Explore case study <ArrowUpRight size={17}/></button>
        <a className="explorer-report" href={project.pdf} target="_blank" rel="noreferrer">Read project report ↗</a>
      </div>
      <div className="explorer-art">
        <div className="art-cross cross-top">+</div><div className="art-cross cross-bottom">+</div>
        <ParticleStudy type={project.visual} paused={paused} resetKey={resetKey}/>
        <div className="explorer-art-caption"><span>FIG. {project.n} / CONCEPTUAL STUDY</span><span>MOVE POINTER TO EXPLORE</span></div>
        <div className="explorer-motion"><button aria-label={paused ? 'Play particle motion' : 'Pause particle motion'} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{paused ? 'Play' : 'Pause'}</span></button><button aria-label="Reset particle view" onClick={() => setResetKey(n => n + 1)}><RotateCcw size={14}/><span>Reset</span></button></div>
      </div>
    </div>
    <div className="explorer-navigation"><span>SELECT A STUDY</span><div><button aria-label="Previous project" onClick={() => select(selected - 1)}><ArrowLeft size={17}/></button><span>{String(selected + 1).padStart(2, '0')} / 07</span><button aria-label="Next project" onClick={() => select(selected + 1)}><ArrowRight size={17}/></button></div><a href="#about">SCROLL TO DISCOVER ↓</a></div>
    <nav className="explorer-tabs" aria-label="Select a project">{projects.map((item, index) => <button key={item.id} aria-pressed={selected === index} onClick={() => select(index)}><span>{item.n}</span>{shortNames[index]}<span className="study-indicator">↗</span></button>)}</nav>
  </section>;
}
