import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ArrowUpRight, Box, User, Briefcase, Layers, Atom, Mail, RotateCcw, Minus, Plus, Pause, Play } from 'lucide-react';
import './portfolio-platform.css';

const stations = [
  { id: 'about', title: 'The engineer', nav: 'About', icon: User, position: [-4, 0, -1.8], color: '#9ae5e5', kicker: '01 / PROFILE', description: 'Meet the person behind the work. Mechanical engineering at UPenn, hands-on curiosity, and a drive to turn research into real-world impact.', stat: 'UPenn', caption: 'M.S. Mechanical Engineering' },
  { id: 'experience', title: 'Built for the real world', nav: 'Experience', icon: Briefcase, position: [-2.2, 0, 2], color: '#f0bc8a', kicker: '02 / INDUSTRY & LEADERSHIP', description: 'Explore medical robotics, manufacturing process development, and the teamwork behind an SAE Baja racing vehicle.', stat: 'Hardware → impact', caption: 'Robotics · Manufacturing · Leadership' },
  { id: 'work', title: 'The project lab', nav: 'Projects', icon: Layers, position: [2.1, 0, 2], color: '#aab6ff', kicker: '03 / SELECTED WORK', description: 'Seven engineering studies spanning robotic manipulation, thermal simulation, microfabrication, and advanced materials. Open the lab to explore every project.', stat: '07 studies', caption: 'Design · Build · Test · Understand' },
  { id: 'research', title: 'Ideas at a smaller scale', nav: 'Research', icon: Atom, position: [4, 0, -1.8], color: '#a6d9af', kicker: '04 / RESEARCH', description: 'Follow the science behind emerging materials and devices, including a peer-reviewed publication on microwave foaming of poly(lactic acid).', stat: '01 publication', caption: 'Polymer Engineering & Science' },
  { id: 'contact', title: 'Start a conversation', nav: 'Contact', icon: Mail, position: [0, 0, -4], color: '#f2abc5', kicker: '05 / CONNECT', description: 'Have a hardware challenge, a research question, or an idea worth building? Let’s connect.', stat: 'Let’s build', caption: 'Hardware · Robotics · Emerging technology' },
];

function buildWorld() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#080d16');
  scene.fog = new THREE.FogExp2('#080d16', .035);
  scene.add(new THREE.HemisphereLight(0xbceeff, 0x182035, 2.5));
  const light = new THREE.DirectionalLight(0xe4f9ff, 3); light.position.set(3, 8, 5); scene.add(light);
  const warm = new THREE.PointLight(0xefbb8b, 25); warm.position.set(-5, 3, 0); scene.add(warm);
  const world = new THREE.Group(); scene.add(world);
  const meshes = [], animated = [], nodes = [];
  const material = (color, metalness = .35) => new THREE.MeshStandardMaterial({ color, metalness, roughness: .4 });
  const dark = material('#17293c'), silver = material('#c0dae1', .65);
  const mesh = (geometry, mat, parent, position = [0, 0, 0]) => {
    const object = new THREE.Mesh(geometry, mat); object.position.set(...position); parent.add(object); return object;
  };
  const box = (w, h, d, mat, parent, xyz) => mesh(new THREE.BoxGeometry(w, h, d), mat, parent, xyz);
  const floor = mesh(new THREE.CircleGeometry(25, 80), material('#0a1420', .1), world, [0, -.3, 0]); floor.rotation.x = -Math.PI / 2;
  const grid = new THREE.GridHelper(40, 70, 0x31596b, 0x182c3d); grid.position.y = -.27;
  grid.material.transparent = true; grid.material.opacity = .34; world.add(grid);
  // An orbit links each station into one navigable engineering workspace.
  const ringPoints = Array.from({ length: 161 }, (_, i) => new THREE.Vector3(Math.cos(i / 160 * Math.PI * 2) * 4.1, -.15, Math.sin(i / 160 * Math.PI * 2) * 3.6 - .7));
  world.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPoints), new THREE.LineBasicMaterial({ color: 0x37586a, transparent: true, opacity: .7 })));
  stations.forEach((station, index) => {
    const group = new THREE.Group(); group.position.set(...station.position); world.add(group);
    const tint = material(station.color, .5);
    const base = mesh(new THREE.CylinderGeometry(1.05, 1.2, .22, 6), dark, group);
    base.userData.station = index;
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(base.geometry), new THREE.LineBasicMaterial({ color: station.color, transparent: true, opacity: .55 })); base.add(edge);
    const halo = mesh(new THREE.TorusGeometry(1.12, .018, 6, 60), new THREE.MeshBasicMaterial({ color: station.color }), group, [0, -.05, 0]); halo.rotation.x = Math.PI / 2;
    const model = new THREE.Group(); model.position.y = .15; group.add(model);
    if (station.id === 'about') {
      mesh(new THREE.IcosahedronGeometry(.44, 1), tint, model, [0, 1.12, 0]);
      mesh(new THREE.CylinderGeometry(.28, .55, .65, 8), silver, model, [0, .49, 0]);
      const orbit = mesh(new THREE.TorusGeometry(.8, .018, 6, 60), tint, model, [0, .85, 0]); orbit.rotation.x = .8;
    } else if (station.id === 'experience') {
      box(.75, .18, .7, silver, model, [0, .1, 0]);
      const shoulder = new THREE.Group(); shoulder.position.set(0, .2, 0); shoulder.rotation.z = -.35; model.add(shoulder);
      box(.2, .9, .24, tint, shoulder, [0, .45, 0]);
      mesh(new THREE.SphereGeometry(.18, 16, 12), silver, shoulder, [0, .9, 0]);
      const forearm = new THREE.Group(); forearm.position.y = .9; forearm.rotation.z = -1.1; shoulder.add(forearm);
      box(.17, .75, .2, silver, forearm, [0, .375, 0]);
      box(.4, .12, .22, tint, forearm, [0, .8, 0]);
      box(.07, .23, .12, tint, forearm, [-.16, .96, 0]); box(.07, .23, .12, tint, forearm, [.16, .96, 0]);
      animated.push({ object: forearm, kind: 'arm', phase: 0 });
    } else if (station.id === 'work') {
      box(1.1, .12, 1, silver, model, [0, .15, 0]);
      for (let i = 0; i < 6; i++) box(.07, .75, .85, tint, model, [i * .18 - .45, .58, 0]);
      const cube = mesh(new THREE.OctahedronGeometry(.22), silver, model, [0, 1.5, 0]); animated.push({ object: cube, kind: 'spin', phase: 1.5 });
    } else if (station.id === 'research') {
      mesh(new THREE.SphereGeometry(.2, 20, 16), silver, model, [0, .9, 0]);
      for (let i = 0; i < 3; i++) {
        const orbit = mesh(new THREE.TorusGeometry(.7, .025, 8, 64), tint, model, [0, .9, 0]); orbit.rotation.set(Math.PI / 2, i * Math.PI / 3, .35);
      }
      mesh(new THREE.SphereGeometry(.1, 12, 8), tint, model, [.7, .9, 0]);
    } else {
      const envelope = box(1.05, .7, .14, tint, model, [0, .9, 0]); envelope.rotation.z = -.12;
      const flap = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.5, 1.22, .09), new THREE.Vector3(0, .85, .09), new THREE.Vector3(.5, 1.22, .09)]);
      model.add(new THREE.Line(flap, new THREE.LineBasicMaterial({ color: '#17293c' })));
    }
    model.traverse(object => { if (object.isMesh) { object.userData.station = index; meshes.push(object); } });
    meshes.push(base); nodes.push({ group, halo, model });
  });
  const dust = new Float32Array(450 * 3);
  for (let i = 0; i < 450; i++) { dust[i * 3] = Math.sin(i * 71.3) * 17; dust[i * 3 + 1] = 2 + (i % 37) * .2; dust[i * 3 + 2] = Math.cos(i * 43.7) * 16; }
  const dustGeometry = new THREE.BufferGeometry(); dustGeometry.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: '#7ba9bd', size: .025, transparent: true, opacity: .45 })));
  return { scene, nodes, meshes, animated };
}

export default function PortfolioPlatform() {
  const [view, setView] = useState(() => window.location.hash ? 'content' : 'world');
  const [selected, setSelected] = useState(() => {
    const index = stations.findIndex(item => `#${item.id}` === window.location.hash);
    return index >= 0 ? index : 2;
  });
  const [paused, setPaused] = useState(false);
  const [fallback, setFallback] = useState(false);
  const hostRef = useRef(null), labels = useRef([]), commands = useRef({});
  const state = useRef({ selected, view, paused });
  const station = stations[selected];
  useEffect(() => { state.current = { selected, view, paused }; }, [selected, view, paused]);
  useEffect(() => {
    document.body.dataset.platformView = view;
    return () => { delete document.body.dataset.platformView; };
  }, [view]);
  useEffect(() => {
    const syncHash = () => {
      const index = stations.findIndex(item => `#${item.id}` === window.location.hash);
      if (index >= 0) setSelected(index);
      setView(window.location.hash ? 'content' : 'world');
    };
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);
  const open = id => {
    const index = stations.findIndex(item => item.id === id); if (index >= 0) setSelected(index);
    setView('content');
    requestAnimationFrame(() => requestAnimationFrame(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' }); history.replaceState(null, '', `#${id}`); }));
  };
  const overview = () => { setView('world'); window.scrollTo({ top: 0, behavior: 'instant' }); history.replaceState(null, '', window.location.pathname + window.location.search); };

  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch { setFallback(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    host.appendChild(renderer.domElement);
    const { scene, nodes, meshes, animated } = buildWorld();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.enablePan = false;
    controls.minDistance = 10; controls.maxDistance = 23;
    controls.minPolarAngle = .35; controls.maxPolarAngle = Math.PI / 2.2;
    controls.enableZoom = false;
    let width = 1, height = 1, last = performance.now(), elapsed = 0, disposed = false;
    const reset = () => { camera.position.set(0, width < 700 ? 7.5 : 10.5, width < 700 ? 11.5 : 14); controls.target.set(0, 0, -.5); controls.update(); };
    const resize = () => {
      width = host.clientWidth; height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height); camera.aspect = width / height;
      camera.fov = width < 700 ? 52 : 42; camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(() => { resize(); }); observer.observe(host); resize(); reset();
    commands.current = { reset, zoom: factor => { camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target); controls.update(); }, rotate: value => { const offset = camera.position.clone().sub(controls.target); offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), value); camera.position.copy(controls.target).add(offset); controls.update(); } };
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    let pointerStart = null;
    const down = e => { pointerStart = [e.clientX, e.clientY]; };
    const up = e => {
      if (!pointerStart || Math.hypot(e.clientX - pointerStart[0], e.clientY - pointerStart[1]) > 7) return;
      const rect = renderer.domElement.getBoundingClientRect(); pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(meshes, false)[0];
      if (hit && Number.isInteger(hit.object.userData.station)) setSelected(hit.object.userData.station);
      pointerStart = null;
    };
    renderer.domElement.addEventListener('pointerdown', down); renderer.domElement.addEventListener('pointerup', up);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    renderer.setAnimationLoop(time => {
      if (disposed) return;
      const delta = Math.min((time - last) / 1000, .05); last = time;
      if (state.current.view !== 'world' || document.hidden) return;
      const moving = !state.current.paused && !reduced.matches;
      if (moving) elapsed += delta;
      nodes.forEach((node, index) => {
        const active = state.current.selected === index;
        node.halo.material.color.set(active ? '#ffffff' : stations[index].color);
        node.halo.scale.setScalar(active ? 1.08 : 1);
        node.model.position.y = .15 + (moving ? Math.sin(elapsed * .8 + index) * .055 : 0);
        if (moving && index !== 1) node.model.rotation.y += delta * .15;
        const label = labels.current[index];
        if (label) {
          const p = new THREE.Vector3(...stations[index].position); p.y = -.2; p.project(camera);
          label.style.left = `${(p.x * .5 + .5) * width}px`; label.style.top = `${(-p.y * .5 + .5) * height + 22}px`;
          label.style.visibility = p.z < 1 && Math.abs(p.x) < .95 && Math.abs(p.y) < .9 ? 'visible' : 'hidden';
        }
      });
      animated.forEach(({ object, kind }) => { if (moving) { if (kind === 'arm') object.rotation.z = -1.1 + Math.sin(elapsed * .65) * .25; else object.rotation.y += delta * .5; } });
      controls.update(); renderer.render(scene, camera);
    });
    const lost = e => { e.preventDefault(); setFallback(true); };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    return () => {
      disposed = true; renderer.setAnimationLoop(null); observer.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', down); renderer.domElement.removeEventListener('pointerup', up); renderer.domElement.removeEventListener('webglcontextlost', lost);
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) { for (const mat of Array.isArray(object.material) ? object.material : [object.material]) materials.add(mat); } });
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); renderer.dispose(); renderer.domElement.remove(); commands.current = {};
    };
  }, []);

  return <>
    <div className="platform-world" hidden={view !== 'world'}>
      <div className="platform-heading"><a href="#home" className="platform-wordmark" onClick={e => { e.preventDefault(); overview(); }}>NI<span>.</span></a><span>THE ENGINEERING WORKSPACE<br/><small>AN INTERACTIVE PORTFOLIO</small></span><button onClick={() => open('home')}>Browse website <ArrowUpRight size={15}/></button></div>
      <div className="platform-welcome"><span className="platform-eyebrow">EXPLORE / SELECT / DISCOVER</span><h1>A world of<br/><span>engineering.</span></h1><p>Five spaces. One curious mind.<br/>Choose a station to step inside.</p><a className="platform-person" href="#about" onClick={e => { e.preventDefault(); open('about'); }}><img src="/headshot.jpg" alt="Nwachukwu Ibekwe"/><span>Nwachukwu Ibekwe<small>Mechanical engineer · UPenn M.S.</small></span><ArrowUpRight size={16}/></a></div>
      <div className="platform-canvas" ref={hostRef} role="img" aria-label="3D engineering workspace. Drag to orbit. Select a station using the labeled buttons or navigation below." />
      <nav className={`platform-labels ${fallback ? 'platform-fallback-labels' : ''}`} aria-label="Select a 3D station">{stations.map((item, index) => <button key={item.id} ref={element => { labels.current[index] = element; }} style={{ '--station-color': item.color }} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item.nav}</button>)}</nav>
      {fallback && <p className="platform-fallback">The 3D scene is unavailable in this browser. All five spaces are available through these station buttons.</p>}
      <aside className="platform-detail" aria-label="Selected station" style={{ '--station-color': station.color }}><span className="platform-eyebrow">{station.kicker}</span><h2>{station.title}</h2><p>{station.description}</p><div className="platform-stat"><strong>{station.stat}</strong><span>{station.caption}</span></div><button onClick={() => open(station.id)}>Enter {station.nav.toLowerCase()} <ArrowUpRight size={18}/></button></aside>
      <div className="platform-controls"><span>DRAG TO ORBIT · SELECT A STATION</span><div><button aria-label="Rotate workspace left" onClick={() => commands.current.rotate?.(-.25)}>↶</button><button aria-label="Rotate workspace right" onClick={() => commands.current.rotate?.(.25)}>↷</button><button aria-label="Zoom in" onClick={() => commands.current.zoom?.(.9)}><Plus size={15}/></button><button aria-label="Zoom out" onClick={() => commands.current.zoom?.(1.1)}><Minus size={15}/></button><button aria-label="Reset workspace view" onClick={() => commands.current.reset?.()}><RotateCcw size={14}/></button><button aria-label={paused ? 'Play workspace motion' : 'Pause workspace motion'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button></div></div>
    </div>
    <nav className="platform-dock" aria-label="Portfolio platform navigation"><button className={view === 'world' ? 'dock-overview active' : 'dock-overview'} aria-current={view === 'world' ? 'page' : undefined} onClick={overview}><Box size={19}/><span>3D workspace</span></button><span className="dock-divider"/>{stations.map((item, index) => { const Icon = item.icon; return <button key={item.id} className={view === 'content' && selected === index ? 'active' : ''} onClick={() => open(item.id)}><Icon size={17}/><span>{item.nav}</span></button>; })}</nav>
  </>;
}
