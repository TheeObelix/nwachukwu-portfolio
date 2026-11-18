import React, { useEffect, useRef } from 'react';
import { projectColors } from './palette';

const COUNT = 1800;
const TAU = Math.PI * 2;

// Deterministic surface samples keep each conceptual model stable between visits.
function pointsFor(type) {
  let seed = 71;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const box = (x, y, z, w, h, d) => {
    const p = [(random() - .5) * w, (random() - .5) * h, (random() - .5) * d];
    const axis = Math.floor(random() * 3);
    p[axis] = [w, h, d][axis] * (random() > .5 ? .5 : -.5);
    return [p[0] + x, p[1] + y, p[2] + z];
  };
  const link = (a, b, radius) => {
    const along = random(), angle = random() * TAU;
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy);
    return [a[0] + dx * along - dy / length * Math.cos(angle) * radius,
      a[1] + dy * along + dx / length * Math.cos(angle) * radius,
      a[2] + (b[2] - a[2]) * along + Math.sin(angle) * radius];
  };
  return Array.from({ length: COUNT }, (_, i) => {
    if (type === 'robot') {
      const section = i % 7;
      if (section === 0) return box(-.65, -.95, 0, 1.1, .2, 1);
      if (section < 3) return link([-.65, -.85, 0], [-.9, .2, 0], .17);
      if (section < 5) return link([-.9, .2, 0], [.05, .9, 0], .14);
      if (section === 5) return link([.05, .9, 0], [.9, .35, 0], .1);
      return box(.93, .2, i % 2 ? -.14 : .14, .3, .4, .08);
    }
    if (type === 'thermal') {
      if (i % 6 === 0) return box(0, -.7, 0, 2.6, .16, 1.8);
      return box((i % 9 - 4) * .28, 0, 0, .055, 1.4, 1.7);
    }
    if (type === 'mems') {
      const side = i % 2, row = Math.floor(i / 2) % 10;
      if (i % 7 === 0) return box(side ? 1.15 : -1.15, 0, 0, .14, .12, 1.9);
      return box(side ? .4 : -.4, 0, row * .18 - .85 + side * .08, 1.4, .12, .05);
    }
    if (type === 'graphene') {
      const cell = Math.floor(i / 6) % 40, col = cell % 8, row = Math.floor(cell / 8);
      const corner = i % 6, angle = corner * TAU / 6;
      return [(col - 3.5) * .32 + (row % 2) * .16 + Math.cos(angle) * .18,
        Math.sin(col * .4 + row * .7) * .12, (row - 2) * .29 + Math.sin(angle) * .18];
    }
    if (type === 'dots') {
      const cell = i % 49, x = cell % 7, z = Math.floor(cell / 7), angle = random() * TAU;
      return [(x - 3) * .36 + Math.cos(angle) * .09, (random() - .5) * .45, (z - 3) * .36 + Math.sin(angle) * .09];
    }
    if (type === 'quantum') {
      const cell = i % 5, angle = random() * TAU, v = random() * 2 - 1;
      const radius = .32 + cell * .025, ring = Math.sqrt(1 - v * v);
      return [Math.cos(cell * TAU / 5) * .9 + radius * ring * Math.cos(angle),
        Math.sin(cell * TAU / 5) * .7 + radius * v, radius * ring * Math.sin(angle)];
    }
    const angle = random() * TAU, v = random() * 2 - 1, radius = .75 + random() * .5;
    return [radius * Math.sqrt(1 - v * v) * Math.cos(angle), radius * v, radius * Math.sqrt(1 - v * v) * Math.sin(angle)];
  });
}

export default function ParticleStudy({ type, paused, resetKey }) {
  const canvasRef = useRef(null);
  const target = useRef(pointsFor(type));
  const colors = useRef(projectColors[type] || projectColors.robot);
  const settings = useRef({ paused, resetKey });
  useEffect(() => { target.current = pointsFor(type); colors.current = projectColors[type] || projectColors.robot; }, [type]);
  useEffect(() => { settings.current = { paused, resetKey }; }, [paused, resetKey]);

  useEffect(() => {
    const canvas = canvasRef.current, context = canvas.getContext('2d');
    if (!context) return;
    const current = target.current.map(p => [...p]);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 1, height = 1, visible = true, frame, last = performance.now();
    let yaw = -.4, pitch = -.2, pointerX = 0, pointerY = 0, lastReset = settings.current.resetKey;
    const resize = () => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio; canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(canvas);
    const pointer = e => {
      const rect = canvas.getBoundingClientRect();
      pointerX = (e.clientX - rect.left) / width - .5;
      pointerY = (e.clientY - rect.top) / height - .5;
    };
    const leave = () => { pointerX = 0; pointerY = 0; };
    canvas.addEventListener('pointermove', pointer); canvas.addEventListener('pointerleave', leave);
    const draw = now => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, .05); last = now;
      if (!visible || document.hidden) return;
      if (lastReset !== settings.current.resetKey) { yaw = -.4; pointerX = 0; pointerY = 0; lastReset = settings.current.resetKey; }
      const animate = !settings.current.paused && !motion.matches;
      if (animate) yaw += dt * .09;
      const yAngle = yaw + (animate ? pointerX * .6 : 0);
      pitch += ((-.24 + (animate ? pointerY * .3 : 0)) - pitch) * Math.min(1, dt * 6);
      const cy = Math.cos(yAngle), sy = Math.sin(yAngle), cx = Math.cos(pitch), sx = Math.sin(pitch);
      const scale = Math.min(width * .28, height * .32);
      context.clearRect(0, 0, width, height);
      // Sparse ambient dust supplies depth without competing with the model.
      for (let i = 0; i < 60; i++) {
        const x = ((i * 137.51) % 997) / 997 * width;
        const y = ((i * 93.17) % 601) / 601 * height;
        context.fillStyle = 'rgba(158,168,184,.13)'; context.fillRect(x, y, 1, 1);
      }
      const projected = current.map((p, i) => {
        const speed = motion.matches || settings.current.paused ? 1 : Math.min(1, dt * 5);
        for (let axis = 0; axis < 3; axis++) p[axis] += (target.current[i][axis] - p[axis]) * speed;
        const x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy;
        const y = p[1] * cx - z * sx, depth = p[1] * sx + z * cx;
        const perspective = 4.5 / (4.5 + depth);
        return { x: width * .5 + x * scale * perspective, y: height * .48 - y * scale * perspective, depth, size: perspective * (width < 500 ? 1 : 1.2), i };
      }).sort((a, b) => b.depth - a.depth);
      projected.forEach(p => {
        const alpha = Math.max(.2, Math.min(.95, .7 - p.depth * .22));
        context.fillStyle = colors.current[p.i % 11 < 2 ? 1 : 0] + Math.round(alpha * 255).toString(16).padStart(2, '0');
        context.beginPath(); context.arc(p.x, p.y, p.size, 0, TAU); context.fill();
      });
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect(); canvas.removeEventListener('pointermove', pointer); canvas.removeEventListener('pointerleave', leave); };
  }, []);
  return <canvas className="particle-study" ref={canvasRef} role="img" aria-label={`Conceptual particle illustration of ${type}. The illustration responds to the pointer; project selection and motion controls are available as buttons.`} />;
}
