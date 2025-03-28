import React from 'react';

interface RangeInterface {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  float?: boolean;
  label: string
}

function Range({ value, onChange, min = 1, max = 100, step = 1, float = true, label } : RangeInterface): React.ReactElement {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">{label}</label>
      <div className="flex flex-row gap-2">
       <input
          type="range"
          onChange={(event) => {
            if(float) {
              onChange(parseFloat(event.target.value));
            } else {
              onChange(parseInt(event.target.value));
            }
          }}
          min={min}
          max={max}
          value={value}
          step={step}
          className="range range-primary">
        </input>
        <span>{value}</span>
      </div>
    </div>
  );
}

export default Range;