"""Banda sonora automática para cualquier spec: cama armónica + efecto por escena/transición.

    node scripts/timeline.mjs specs/x.json && python -m sfx sfx/cues/auto.py
"""

from sfx.synth import blip, chime, envelope, impact, pad, pop, riser, whoosh

TIMELINE = "timeline.json"
OUT = "public/sfx.wav"
TARGET_LUFS = -14.0

BED_A = [110.0, 164.81, 220.0, 329.63, 493.88]
BED_B = [87.31, 130.81, 174.61, 261.63, 440.0]


def score(mix, tl):
    dur = tl["duration"]
    scenes = tl["scenes"]
    volume = envelope([(0, 0), (1.2, 1), (dur - 1.5, 1), (dur, 0)])
    half = dur / 2
    if tl.get("cama", True):
        mix.put_stereo(0, *pad(dur, [(0, BED_A), (half, BED_B)], volume=volume), gain=0.035)

    for i, s in enumerate(scenes):
        t = s["start"]
        if i == 0:
            put_open(mix, t)
        else:
            mix.put(t - 0.35, riser(0.35, 400, 3000), 0.07)
            mix.put(t, whoosh(0.6, 300, 2200, peak=0.5), 0.14, -0.2 if i % 2 else 0.2)
            mix.put(t + 0.05, impact(0.8), 0.12)
        mix.put(t + 0.25, chime([1318.5, 1975.5], dur=1.2, tau=0.4), 0.07)
        mix.put(t + 0.45, pop(520, 220), 0.18)
        mix.put(t + 0.9, blip(98, dur=0.3, tau=0.08), 0.15)
    mix.put(dur - 1.6, chime([880.0, 1318.5, 1760.0], dur=1.5, tau=0.5), 0.08)


def put_open(mix, t):
    mix.put(t + 0.05, whoosh(0.9, 200, 1400, peak=0.4), 0.12)
    mix.put(t + 0.1, impact(1.0), 0.12)
