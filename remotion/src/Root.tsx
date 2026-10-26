import React from 'react';
import {Composition} from 'remotion';
import {Video, totalFrames, FPS} from './Video';
import type {VideoSpec} from './types';
import demo from '../specs/demo.json';

const SIZES = {horizontal: {width: 1920, height: 1080}, vertical: {width: 1080, height: 1920}};

export const Root: React.FC = () => {
  const spec = demo as VideoSpec;
  return (
    <>
      {(['horizontal', 'vertical'] as const).map((f) => (
        <Composition
          key={f}
          id={f === 'horizontal' ? 'Horizontal' : 'Vertical'}
          component={Video}
          fps={FPS}
          {...SIZES[f]}
          durationInFrames={totalFrames(spec)}
          defaultProps={{spec: {...spec, formato: f}}}
          calculateMetadata={({props}) => ({durationInFrames: totalFrames(props.spec)})}
        />
      ))}
    </>
  );
};
