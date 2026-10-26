import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Word} from './types';

// Subtítulos estilo Reels: grupos de hasta 6 palabras, la palabra que suena se resalta.
export const Captions: React.FC<{words: Word[]; offsetSec: number; color: string; font: string; vertical: boolean; exit: number}> = ({words, offsetSec, color, font, vertical, exit}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chunks = useMemo(() => {
    const out: Word[][] = [];
    let cur: Word[] = [];
    for (const w of words) {
      cur.push(w);
      if (cur.length >= 6 || /[.,;:!?]$/.test(w.text.trim())) {
        out.push(cur);
        cur = [];
      }
    }
    if (cur.length) out.push(cur);
    return out;
  }, [words]);
  const t = (f / fps - offsetSec) * 1000;
  let idx = -1;
  chunks.forEach((c, i) => {
    if (c[0].startMs - 60 <= t) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  if (idx === chunks.length - 1 && t > chunk[chunk.length - 1].endMs + 500) return null;
  const inP = interpolate(t, [chunk[0].startMs - 60, chunk[0].startMs + 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: vertical ? 260 : 70}}>
      <div style={{opacity: inP * exit, transform: `translateY(${(1 - inP) * 16}px)`, background: '#000c', padding: '16px 34px', borderRadius: 18, maxWidth: '88%', textAlign: 'center', fontFamily: font, fontWeight: 600, fontSize: vertical ? 54 : 46, lineHeight: 1.25}}>
        {chunk.map((w, i) => (
          <span key={i} style={{color: t >= w.startMs ? color : '#fff'}}>
            {w.text.trim()}{' '}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
