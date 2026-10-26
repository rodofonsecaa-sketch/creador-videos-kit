import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Circle, Triangle} from '@remotion/shapes';
import {noise2D} from '@remotion/noise';

// Formas geométricas sutiles que flotan con ruido Perlin (da profundidad al fondo).
export const Decor: React.FC<{color: string; vertical: boolean}> = ({color, vertical}) => {
  const f = useCurrentFrame();
  const W = vertical ? 1080 : 1920;
  const H = vertical ? 1920 : 1080;
  const shapes = [
    {x: 0.12, y: 0.2, r: 150, kind: 'c'},
    {x: 0.88, y: 0.75, r: 210, kind: 'c'},
    {x: 0.8, y: 0.15, r: 90, kind: 't'},
    {x: 0.18, y: 0.82, r: 100, kind: 't'},
  ];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {shapes.map((s, i) => {
        const dx = noise2D(`x${i}`, f / 140, i) * 50;
        const dy = noise2D(`y${i}`, f / 140, i + 9) * 50;
        const rot = noise2D(`r${i}`, f / 200, i) * 40;
        const common = {fill: 'none', stroke: color, strokeWidth: 3} as const;
        return (
          <div key={i} style={{position: 'absolute', left: s.x * W - s.r + dx, top: s.y * H - s.r + dy, opacity: 0.22, transform: `rotate(${rot}deg)`}}>
            {s.kind === 'c' ? <Circle radius={s.r} {...common} /> : <Triangle length={s.r * 2} direction="up" {...common} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Grano de película (textura) + viñeta: evita el look plano de "video generado".
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: 0.08, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 8} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
