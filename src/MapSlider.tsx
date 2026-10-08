// Adapted from Stealth UI, copyright (c) 2026 Paragon.
// MIT license: /licenses/stealth-ui-MIT.txt.
// https://www.stealth.pm/ui/slider
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { useState } from 'react';
import './stealth-controls.css';

interface MapSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  largeStep?: number;
  disabled?: boolean;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export default function MapSlider({ label, value, min, max, step = 1, largeStep = step * 10,
  disabled, onValueChange, formatValue = String }: MapSliderProps) {
  const [motion, setMotion] = useState<'glide' | 'instant'>('glide');
  const displayed = Math.min(max, Math.max(min, value));
  return <BaseSlider.Root className="stealth-slider" value={displayed} min={min} max={max}
    step={step} largeStep={largeStep} disabled={disabled} data-motion={motion}
    onValueChange={(next, details) => {
      setMotion(details.reason === 'track-press' ? 'glide' : 'instant');
      onValueChange(next as number);
    }} onValueCommitted={(_, details) => { if (details.reason === 'drag') setMotion('glide'); }}>
    <div className="stealth-slider-heading">
      <BaseSlider.Label>{label}</BaseSlider.Label>
      <span className="stealth-slider-value" aria-hidden="true">{formatValue(displayed)}</span>
    </div>
    <BaseSlider.Control className="stealth-slider-control">
      <BaseSlider.Track className="stealth-slider-track">
        <div aria-hidden="true" className="stealth-slider-fill" style={{ width: `${(displayed - min) / (max - min) * 100}%` }}/>
        <BaseSlider.Thumb aria-label={label} getAriaValueText={(_, next) => formatValue(next)} className="stealth-slider-thumb">
          <span aria-hidden="true" className="stealth-slider-knob"/>
          <span aria-hidden="true" className="stealth-slider-bubble">{formatValue(displayed)}</span>
        </BaseSlider.Thumb>
      </BaseSlider.Track>
    </BaseSlider.Control>
  </BaseSlider.Root>;
}
