import React from 'react';
import {AbsoluteFill, Audio, Img, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming, type TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {BarChart, KpiRow} from './Charts';
import {LightLeak} from '@remotion/light-leaks';
import {Captions} from './Captions';
import {Decor, Grain} from './Decor';
import {AccentBar, Cierre, Cifra, Dividida, KineticTitle, LightSweep, Pasos} from './Templates';
import type {Scene, VideoSpec} from './types';

export const FPS = 30;
const TRANS = 15;
const DEFAULT_COLORS: [string, string, string] = ['#0b1d3a', '#1d4ed8', '#f59e0b'];
const {fontFamily: FONT} = loadPoppins('normal', {weights: ['400', '600', '800'], subsets: ['latin', 'latin-ext']});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const sceneFrames = (e: Scene) => Math.round((e.segundos ?? 3) * FPS);

export const totalFrames = (spec: VideoSpec) => spec.escenas.reduce((a, e) => a + sceneFrames(e), 0) - TRANS * (spec.escenas.length - 1);

const Background: React.FC<{colors: [string, string, string]; img?: string; video?: string; dur: number}> = ({colors, img, video, dur}) => {
  const f = useCurrentFrame();
  const t = f / dur;
  const scale = interpolate(t, [0, 1], [1, 1.1], {easing: Easing.inOut(Easing.cubic)});
  const px = interpolate(t, [0, 1], [0, -30]);
  return (
    <AbsoluteFill style={{background: colors[0]}}>
      {video ? (
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(`video/${video}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : img ? (
        <AbsoluteFill style={{transform: `scale(${scale}) translateX(${px}px)`}}>
          <Img src={staticFile(`img/${img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at ${30 + t * 40}% ${35 + t * 20}%, ${colors[1]} 0%, transparent 55%), radial-gradient(circle at ${75 - t * 30}% 80%, ${colors[2]}55 0%, transparent 50%), ${colors[0]}`,
          }}
        />
      )}
      {(img || video) && <AbsoluteFill style={{background: 'linear-gradient(180deg,#0008 0%,#000a 100%)'}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, #0009 100%)'}} />
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{scene: Scene; spec: VideoSpec; dur: number}> = ({scene, spec, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const vertical = spec.formato === 'vertical';
  const colors = spec.colores ?? DEFAULT_COLORS;
  const enter = (delay: number) => spring({frame: f - delay, fps, config: {damping: 16, stiffness: 110}});
  const exit = interpolate(f, [dur - 10, dur], [1, 0], clamp);
  const item = (delay: number): React.CSSProperties => {
    const e = enter(delay);
    return {opacity: e * exit, transform: `translateY(${(1 - e) * 50}px) scale(${0.94 + e * 0.06})`};
  };
  const hasData = !!(scene.grafico || scene.kpis);
  const capIn = interpolate(f, [18, 28], [0, 1], clamp);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Background colors={colors} img={scene.plantilla === 'dividida' ? undefined : scene.imagen} video={scene.video} dur={dur} />
      <Decor color={colors[2]} vertical={vertical} />
      <CameraMotionBlur shutterAngle={110} samples={5}>
        {scene.plantilla === 'dividida' ? (
          <Dividida scene={scene} colors={colors} vertical={vertical} exit={exit} dur={dur} />
        ) : scene.plantilla === 'cifra' && scene.cifra ? (
          <Cifra scene={scene} colors={colors} vertical={vertical} exit={exit} />
        ) : scene.plantilla === 'pasos' && scene.pasos ? (
          <Pasos scene={scene} colors={colors} vertical={vertical} exit={exit} />
        ) : scene.plantilla === 'cierre' ? (
          <Cierre scene={scene} colors={colors} vertical={vertical} exit={exit} marca={spec.marca} />
        ) : (
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: vertical ? 80 : 150, textAlign: 'center', paddingBottom: hasData ? (vertical ? 200 : 170) : undefined}}>
            <KineticTitle text={scene.titulo} size={hasData ? (vertical ? 80 : 76) : vertical ? 104 : 112} exit={exit} />
            <AccentBar color={colors[2]} exit={exit} />
            {scene.subtitulo && !hasData && <div style={{...item(14), color: '#e6edf7', fontWeight: 400, fontSize: vertical ? 52 : 50}}>{scene.subtitulo}</div>}
            {scene.grafico && <BarChart datos={scene.grafico.datos} unidad={scene.grafico.unidad} colors={colors} vertical={vertical} exit={exit} />}
            {scene.kpis && <KpiRow kpis={scene.kpis} colors={colors} vertical={vertical} exit={exit} />}
          </AbsoluteFill>
        )}
      </CameraMotionBlur>
      <LightSweep />
      {scene.palabras?.length ? (
        <Captions words={scene.palabras} offsetSec={scene.vozInicio ?? 0} color={colors[2]} font={FONT} vertical={vertical} exit={exit} />
      ) : (
        scene.subtitulo_pie && (
          <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: vertical ? 260 : 70}}>
            <div style={{opacity: capIn * exit, background: '#000b', color: '#fff', fontWeight: 600, fontSize: vertical ? 46 : 40, padding: '14px 32px', borderRadius: 14, maxWidth: '86%', textAlign: 'center'}}>{scene.subtitulo_pie}</div>
          </AbsoluteFill>
        )
      )}
      {scene.voz && (
        <Sequence from={Math.round((scene.vozInicio ?? 0) * FPS)}>
          <Audio src={staticFile(scene.voz)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

const Brand: React.FC<{spec: VideoSpec}> = ({spec}) => {
  const m = spec.marca;
  if (!m || (!m.nombre && !m.logo)) return null;
  const vertical = spec.formato === 'vertical';
  return (
    <AbsoluteFill style={{padding: vertical ? 60 : 50, pointerEvents: 'none'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: 0.9, fontFamily: FONT}}>
        {m.logo && <Img src={staticFile(`img/${m.logo}`)} style={{height: vertical ? 70 : 56}} />}
        {m.nombre && <div style={{color: '#fff', fontWeight: 600, fontSize: vertical ? 38 : 30, letterSpacing: 2, textTransform: 'uppercase'}}>{m.nombre}</div>}
      </div>
    </AbsoluteFill>
  );
};

const pick = (t: Scene['transicion'], vertical: boolean): TransitionPresentation<any> => {
  if (t === 'slide') return slide({direction: vertical ? 'from-bottom' : 'from-right'});
  if (t === 'wipe') return wipe({direction: vertical ? 'from-top' : 'from-left'});
  return fade();
};

export const Video: React.FC<{spec: VideoSpec}> = ({spec}) => {
  const total = totalFrames(spec);
  const f = useCurrentFrame();
  const base = spec.volumenMusica ?? 0.6;
  const vol = interpolate(f, [0, 20, total - 45, total], [0, base, base, 0], clamp);
  const vertical = spec.formato === 'vertical';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <TransitionSeries>
        {spec.escenas.flatMap((e, i) => {
          const dur = sceneFrames(e);
          const nodes: React.ReactNode[] = [];
          if (i > 0) {
            nodes.push(<TransitionSeries.Transition key={`t${i}`} presentation={pick(e.transicion, vertical)} timing={linearTiming({durationInFrames: TRANS})} />);
          }
          nodes.push(
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={dur}>
              <SceneView scene={e} spec={spec} dur={dur} />
            </TransitionSeries.Sequence>,
          );
          return nodes;
        })}
      </TransitionSeries>
      {spec.escenas.map((e, i) => {
        if (i === 0) return null;
        const start = spec.escenas.slice(0, i).reduce((a, x) => a + sceneFrames(x), 0) - i * TRANS - Math.round(TRANS / 2);
        return (
          <Sequence key={`ll${i}`} from={Math.max(0, start)} durationInFrames={TRANS * 2}>
            <LightLeak seed={i} hueShift={30} />
          </Sequence>
        );
      })}
      <Brand spec={spec} />
      <Grain />
      <AbsoluteFill style={{justifyContent: 'flex-end', pointerEvents: 'none'}}>
        <div style={{height: 8, width: `${(f / total) * 100}%`, background: (spec.colores ?? DEFAULT_COLORS)[2], boxShadow: `0 0 18px ${(spec.colores ?? DEFAULT_COLORS)[2]}`}} />
      </AbsoluteFill>
      {spec.pista && <Audio src={staticFile(spec.pista)} loop volume={interpolate(f, [0, 30, total - 60, total], [0, spec.volumenPista ?? 0.16, spec.volumenPista ?? 0.16, 0], clamp)} />}
      {spec.musica && <Audio src={staticFile(spec.musica)} volume={vol} />}
    </AbsoluteFill>
  );
};
