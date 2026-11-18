import React, { useState } from 'react';
import './scene3d.css';

function Box({ x = 0, y = 0, z = 0, w = 50, h = 50, d = 50, color = '#8bb8ef' }) {
  return <div className="solid" style={{ '--w': `${w}px`, '--h': `${h}px`, '--d': `${d}px`, '--color': color, transform: `translate3d(${x}px, ${y}px, ${z}px)` }}>
    {['front', 'back', 'left', 'right', 'top', 'bottom'].map(face => <i key={face} className={`face ${face}`} />)}
  </div>;
}

function Model({ type, pose }) {
  if (type === 'robot' || type === 'hero') return <>
    <Box x={-70} y={95} w={140} h={18} d={110} color="#4c586a" />
    <Box x={-26} y={48} w={52} h={48} d={52} />
    <div className="joint" style={{ transform: `translate3d(0px, 52px, 0px) rotateZ(${-35 + pose * .35}deg)` }}>
      <Box x={-15} y={-115} w={30} h={115} d={32} />
      <Box x={-23} y={-130} w={46} h={30} d={46} color="#e5b477" />
      <div className="joint" style={{ transform: `translateY(-115px) rotateZ(${65 - pose * .7}deg)` }}>
        <Box x={-12} y={-90} w={24} h={90} d={26} />
        <Box x={-22} y={-110} w={44} h={25} d={35} color="#4c586a" />
        <Box x={-24} y={-138} w={9} h={30} d={12} color="#e5b477" />
        <Box x={15} y={-138} w={9} h={30} d={12} color="#e5b477" />
      </div>
    </div>
    <Box x={85} y={65} z={35} w={30} h={30} d={30} color="#e5b477" />
  </>;
  if (type === 'thermal') return <>
    <Box x={-125} y={60} w={250} h={18} d={150} color="#e5b477" />
    {Array.from({ length: 8 }, (_, i) => <Box key={i} x={-115 + i * 31} y={-60 - pose * .4} w={10} h={120 + pose * .4} d={140} color={`hsl(${25 + i * 22}, 48%, ${66 - i * 2}%)`} />)}
  </>;
  if (type === 'mems') return <>
    <Box x={-145} y={20} w={290} h={10} d={170} color="#303947" />
    <Box x={-135} y={0} w={20} h={16} d={150} />
    <Box x={100 - pose * .35} y={-5} w={20} h={16} d={150} color="#e5b477" />
    {Array.from({ length: 7 }, (_, i) => <React.Fragment key={i}>
      <Box x={-115} y={0} z={-65 + i * 22} w={140} h={12} d={7} />
      <Box x={-10 - pose * .35} y={-5} z={-54 + i * 22} w={120} h={12} d={7} color="#e5b477" />
    </React.Fragment>)}
  </>;
  return <div className={`material-model ${type}`}>
    {Array.from({ length: type === 'graphene' ? 30 : 36 }, (_, i) => {
      const col = i % 6, row = Math.floor(i / 6);
      const depth = type === 'graphene' ? 0 : Math.sin(i * 2.4) * (50 + pose * .4);
      return <div className="atom" key={i} style={{ transform: `translate3d(${col * 38 - 95 + (row % 2) * 12}px, ${row * 34 - 85}px, ${depth}px)`, '--atom-color': type === 'quantum' ? `hsl(${260 + i % 5 * 15}, 45%, 72%)` : '#80cabb', width: type === 'aerogel' ? 12 : 19, height: type === 'aerogel' ? 12 : 19 }} />;
    })}
  </div>;
}

export default function Scene3D({ type = 'robot', hero = false }) {
  const [rotation, setRotation] = useState({ x: -18, y: -28 });
  const [pose, setPose] = useState(30);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const label = type === 'thermal' ? 'Fin height' : type === 'mems' ? 'Actuator displacement' : type === 'robot' || hero ? 'Arm pose' : 'Structure depth';
  return <div className={`scene3d ${hero ? 'hero-scene' : ''}`}>
    <div className="scene-caption"><span>{hero ? 'ROBOTICS / IN MOTION' : 'INTERACTIVE 3D STUDY'}</span><span className="live-dot" /></div>
    <div className="scene-viewport" role="img" aria-label={`Interactive conceptual ${type === 'hero' ? 'robot arm' : type} model. Drag to rotate; use controls below for keyboard adjustments.`}
      onPointerDown={e => { if (e.button !== 0) return; e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); setPaused(true); }}
      onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}
      onPointerMove={e => {
        if (dragging) setRotation(r => ({ x: Math.max(-75, Math.min(75, r.x - e.movementY * .5)), y: r.y + e.movementX * .5 }));
        else if (hero && e.pointerType === 'mouse') { const bounds = e.currentTarget.getBoundingClientRect(); setRotation({ x: -18 - ((e.clientY - bounds.top) / bounds.height - .5) * 16, y: -28 + ((e.clientX - bounds.left) / bounds.width - .5) * 35 }); }
      }}>
      <div className="scene-orbit" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})` }}>
        <div className={`scene-model ${paused ? 'is-paused' : ''}`}><div className="scene-floor" /><Model type={type} pose={pose} /></div>
      </div>
      <span className="scene-hint">{dragging ? 'Exploring' : 'Drag to rotate · adjust below'}</span>
    </div>
    <div className="scene-controls">
      <label>{label}<input aria-label={label} type="range" min="0" max="100" value={pose} onChange={e => setPose(Number(e.target.value))} /></label>
      <label>View angle<input aria-label="View angle" type="range" min="-180" max="180" value={((rotation.y + 180) % 360 + 360) % 360 - 180} onChange={e => { setPaused(true); setRotation(r => ({ ...r, y: Number(e.target.value) })); }} /></label>
      <label>Zoom<input aria-label="Zoom" type="range" min="0.7" max="1.3" step="0.05" value={zoom} onChange={e => setZoom(Number(e.target.value))} /></label>
      <div className="scene-buttons"><button type="button" onClick={() => setPaused(p => !p)}>{paused ? 'Animate' : 'Pause'}</button><button type="button" onClick={() => { setRotation({ x: -18, y: -28 }); setPose(30); setZoom(1); setPaused(false); }}>Reset</button></div>
    </div>
    <p className="scene-note">Conceptual illustration · geometry and motion are illustrative.</p>
  </div>;
}
