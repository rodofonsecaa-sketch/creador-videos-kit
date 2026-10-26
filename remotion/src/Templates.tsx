import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AlertTriangle, BarChart3, Boxes, Check, CheckCircle2, Clock, DollarSign, Globe, Package, Plane, Settings, ShieldCheck, Ship, Target, TrendingUp, Truck, Users, Warehouse, Zap} from 'lucide-react';
import {Underline} from '@remotion/rough-notation';
import type {Scene} from './types';

type C3 = [string, string, string];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fmt = (n: number) => Math.round(n).toLocaleString('es-CL');

export const ICONOS: Record<string, React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>> = {
  camion: Truck, caja: Package, cajas: Boxes, bodega: Warehouse, grafico: BarChart3, reloj: Clock, check: CheckCircle2,
  alerta: AlertTriangle, dinero: DollarSign, usuarios: Users, mundo: Globe, engranaje: Settings, escudo: ShieldCheck,
  tendencia: TrendingUp, barco: Ship, avion: Plane, meta: Target, rayo: Zap,
};

export const glass: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ffffff1f, #ffffff0a)',
  border: '1.5px solid #ffffff2e',
  backdropFilter: 'blur(18px)',
  boxShadow: '0 20px 60px #0006, inset 0 1px 0 #ffffff33',
};

// Título palabra por palabra: sube, se enfoca (blur → nítido) y entra escalonado.
export const KineticTitle: React.FC<{text: string; size: number; exit: number; delay?: number; align?: 'center' | 'left'}> = ({text, size, exit, delay = 0, align = 'center'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', columnGap: size * 0.28, rowGap: size * 0.05, opacity: exit}}>
      {text.split(' ').map((w, i) => {
        const p = spring({frame: f - delay - i * 4, fps, config: {damping: 15, stiffness: 120}});
        return (
          <span key={i} style={{display: 'inline-block', color: '#fff', fontWeight: 800, fontSize: size, lineHeight: 1.08, opacity: p, transform: `translateY(${(1 - p) * 70}px) scale(${0.9 + p * 0.1})`, filter: `blur(${(1 - p) * 14}px)`, textShadow: '0 8px 40px #0009'}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const AccentBar: React.FC<{color: string; exit: number; align?: 'center' | 'left'}> = ({color, exit, align = 'center'}) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [8, 26], [0, 150], {...clamp, easing: Easing.out(Easing.cubic)});
  return <div style={{width: w, height: 8, borderRadius: 4, background: color, margin: align === 'center' ? '34px auto' : '30px 0', opacity: exit}} />;
};

// Barrido de luz diagonal al entrar cada escena (da sensación de producción).
export const LightSweep: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 38], [-40, 140], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: '-20%', height: '140%', width: '36%', left: `${x}%`, transform: 'skewX(-20deg)', background: 'linear-gradient(90deg, transparent, #ffffff26, transparent)'}} />
    </AbsoluteFill>
  );
};

const rise = (f: number, fps: number, delay: number) => spring({frame: f - delay, fps, config: {damping: 17, stiffness: 100}});

export const Dividida: React.FC<{scene: Scene; colors: C3; vertical: boolean; exit: number; dur: number}> = ({scene, colors, vertical, exit, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = rise(f, fps, 2);
  const zoom = interpolate(f, [0, dur], [1.02, 1.14]);
  const panel: React.CSSProperties = vertical
    ? {width: '100%', height: 760, transform: `translateY(${(1 - p) * -90}px)`}
    : {width: '47%', height: 720, transform: `translateX(${(1 - p) * -120}px)`};
  return (
    <AbsoluteFill style={{flexDirection: vertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: vertical ? 56 : 90, padding: vertical ? '170px 70px 330px' : '90px 120px 150px'}}>
      <div style={{...panel, ...glass, flex: 'none', borderRadius: 40, overflow: 'hidden', opacity: p * exit, padding: 0}}>
        {scene.imagen && <Img src={staticFile(`img/${scene.imagen}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />}
      </div>
      <div style={{flex: 1, opacity: exit, textAlign: 'left'}}>
        <KineticTitle text={scene.titulo} size={vertical ? 76 : 70} exit={exit} delay={6} align="left" />
        <AccentBar color={colors[2]} exit={exit} align="left" />
        {scene.subtitulo && <div style={{color: '#dbe5f3', fontSize: vertical ? 40 : 38, marginBottom: 26, opacity: rise(f, fps, 16) * exit}}>{scene.subtitulo}</div>}
        {scene.puntos?.map((t, i) => {
          const q = rise(f, fps, 22 + i * 9);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, margin: '18px 0', opacity: q * exit, transform: `translateX(${(1 - q) * 50}px)`}}>
              <div style={{width: 52, height: 52, borderRadius: 26, background: colors[2], display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
                <Check size={32} color="#0b1d3a" strokeWidth={3.5} />
              </div>
              <div style={{color: '#fff', fontSize: vertical ? 44 : 42, fontWeight: 600}}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Cifra: React.FC<{scene: Scene; colors: C3; vertical: boolean; exit: number}> = ({scene, colors, vertical, exit}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = scene.cifra!;
  const p = spring({frame: f - 10, fps, config: {damping: 20, stiffness: 70}});
  const R = vertical ? 330 : 260;
  const circ = 2 * Math.PI * R;
  const pct = c.porcentaje ?? undefined;
  const num = (
    <div style={{color: '#fff', fontWeight: 800, fontSize: vertical ? 190 : 170, textShadow: `0 0 60px ${colors[2]}99`, lineHeight: 1}}>
      {c.prefijo ?? ''}{fmt(c.valor * p)}<span style={{color: colors[2]}}>{c.sufijo ?? ''}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: exit, padding: 100, paddingBottom: 220}}>
      <div style={{marginBottom: 40}}>
        <KineticTitle text={scene.titulo} size={vertical ? 72 : 64} exit={1} />
      </div>
      <div style={{position: 'relative', width: R * 2 + 40, height: R * 2 + 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: Math.min(1, p * 2)}}>
        {pct !== undefined && (
          <svg width={R * 2 + 40} height={R * 2 + 40} style={{position: 'absolute', transform: 'rotate(-90deg)'}}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke="#ffffff1c" strokeWidth={26} />
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={colors[2]} strokeWidth={26} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - (pct / 100) * p)} />
          </svg>
        )}
        {num}
        <div style={{color: '#dbe5f3', fontSize: vertical ? 48 : 42, marginTop: 14}}><Underline progress={interpolate(f, [30, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color={colors[2]} strokeWidth={5}>{c.etiqueta}</Underline></div>
      </div>
    </AbsoluteFill>
  );
};

export const Pasos: React.FC<{scene: Scene; colors: C3; vertical: boolean; exit: number}> = ({scene, colors, vertical, exit}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pasos = scene.pasos!;
  const line = interpolate(f, [12, 12 + pasos.length * 12], [0, 100], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: exit, padding: vertical ? 70 : 110, paddingBottom: vertical ? 300 : 190}}>
      <KineticTitle text={scene.titulo} size={vertical ? 76 : 68} exit={1} />
      <AccentBar color={colors[2]} exit={1} />
      <div style={{position: 'relative', display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: vertical ? 34 : 40, width: '100%', justifyContent: 'center', marginTop: 20}}>
        {!vertical && <div style={{position: 'absolute', top: 70, left: '8%', height: 4, width: `${line * 0.84}%`, background: `linear-gradient(90deg, ${colors[1]}, ${colors[2]})`, borderRadius: 2}} />}
        {pasos.map((s, i) => {
          const p = spring({frame: f - 12 - i * 12, fps, config: {damping: 13, stiffness: 120}});
          const Icon = ICONOS[s.icono] ?? Check;
          return (
            <div key={i} style={{flex: 1, display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: 'center', gap: vertical ? 34 : 22, textAlign: vertical ? 'left' : 'center', opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + p * 0.15})`}}>
              <div style={{...glass, width: 140, height: 140, borderRadius: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: 'none', border: `2px solid ${colors[2]}88`}}>
                <Icon size={64} color={colors[2]} strokeWidth={2} />
                <div style={{position: 'absolute', top: -6, right: -6, width: 44, height: 44, borderRadius: 22, background: colors[2], color: '#0b1d3a', fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
              </div>
              <div>
                <div style={{color: '#fff', fontWeight: 800, fontSize: vertical ? 50 : 42}}>{s.titulo}</div>
                {s.detalle && <div style={{color: '#cfdaec', fontSize: vertical ? 36 : 30, marginTop: 8}}>{s.detalle}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Cierre: React.FC<{scene: Scene; colors: C3; vertical: boolean; exit: number; marca?: {nombre?: string; logo?: string}}> = ({scene, colors, vertical, exit, marca}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = rise(f, fps, 24);
  const pulse = 1 + Math.sin(f / 8) * 0.025;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: vertical ? 80 : 150, textAlign: 'center', opacity: exit}}>
      {marca?.logo && <Img src={staticFile(`img/${marca.logo}`)} style={{height: vertical ? 150 : 120, marginBottom: 40, opacity: p}} />}
      <KineticTitle text={scene.titulo} size={vertical ? 100 : 108} exit={1} />
      <AccentBar color={colors[2]} exit={1} />
      {scene.subtitulo && <div style={{color: '#e6edf7', fontSize: vertical ? 50 : 46, opacity: rise(f, fps, 14)}}>{scene.subtitulo}</div>}
      {scene.cta && (
        <div style={{marginTop: 56, padding: '26px 70px', borderRadius: 100, background: colors[2], color: '#0b1d3a', fontWeight: 800, fontSize: vertical ? 54 : 48, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${pulse})`, boxShadow: `0 20px 60px ${colors[2]}66`}}>
          {scene.cta}
        </div>
      )}
      {marca?.nombre && <div style={{marginTop: 60, color: '#ffffffcc', fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', opacity: p}}>{marca.nombre}</div>}
    </AbsoluteFill>
  );
};
