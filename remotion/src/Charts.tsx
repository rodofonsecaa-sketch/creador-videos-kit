import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Bar, Kpi} from './types';

const fmt = (n: number) => Math.round(n).toLocaleString('es-CL');

export const BarChart: React.FC<{datos: Bar[]; unidad?: string; colors: [string, string, string]; vertical: boolean; exit: number}> = ({datos, unidad, colors, vertical, exit}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const max = Math.max(...datos.map((d) => d.valor));
  const size = vertical ? 44 : 38;
  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: vertical ? 34 : 24, opacity: exit}}>
      {datos.map((d, i) => {
        const p = spring({frame: f - 16 - i * 6, fps, config: {damping: 18, stiffness: 90}});
        return (
          <div key={d.etiqueta} style={{display: 'flex', alignItems: 'center', gap: 28, opacity: Math.min(1, p * 2)}}>
            <div style={{width: vertical ? 250 : 320, color: '#e6edf7', fontSize: size, textAlign: 'right'}}>{d.etiqueta}</div>
            <div style={{flex: 1, height: vertical ? 56 : 52, background: '#ffffff18', borderRadius: 14, overflow: 'hidden'}}>
              <div style={{width: `${(d.valor / max) * 100 * p}%`, height: '100%', borderRadius: 14, background: `linear-gradient(90deg, ${colors[1]}, ${colors[2]})`}} />
            </div>
            <div style={{width: vertical ? 200 : 230, color: '#fff', fontSize: size, fontWeight: 800}}>
              {fmt(d.valor * p)}
              {unidad ? ` ${unidad}` : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const KpiRow: React.FC<{kpis: Kpi[]; colors: [string, string, string]; vertical: boolean; exit: number}> = ({kpis, colors, vertical, exit}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: 40, width: '100%', justifyContent: 'center', opacity: exit}}>
      {kpis.map((k, i) => {
        const p = spring({frame: f - 14 - i * 8, fps, config: {damping: 20, stiffness: 80}});
        const y = interpolate(p, [0, 1], [60, 0]);
        return (
          <div key={k.etiqueta} style={{flex: 1, transform: `translateY(${y}px)`, opacity: Math.min(1, p * 2), background: '#ffffff14', border: `2px solid ${colors[2]}66`, borderRadius: 28, padding: '40px 30px', textAlign: 'center'}}>
            <div style={{color: colors[2], fontWeight: 800, fontSize: vertical ? 110 : 96}}>
              {k.prefijo ?? ''}
              {fmt(k.valor * p)}
              {k.sufijo ?? ''}
            </div>
            <div style={{color: '#e6edf7', fontSize: vertical ? 46 : 38, marginTop: 8}}>{k.etiqueta}</div>
          </div>
        );
      })}
    </div>
  );
};
