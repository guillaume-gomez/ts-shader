import React, { useState } from 'react';

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
  const [edit, setEdit] = useState<boolean>(false);

  function onChangeFunc(value: string) {
    if(float) {
      onChange(parseFloat(value));
    } else {
      onChange(parseInt(value));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="label cursor-pointer">{label}</label>
      <div className="flex flex-row gap-2">
       <input
          type="range"
          onChange={(event) => onChangeFunc(event.target.value) }
          min={min}
          max={max}
          value={value}
          step={step}
          className="range range-primary">
        </input>
        <span
          onClick={() => setEdit(true)}
        >
          {
            edit ?
            <input
              type="number"
              value={value}
              onChange={(event) => onChangeFunc(event.target.value)}
              min={min}
              max={max}
              step={step}
            /> :
            value
          } 
        </span>
      </div>
    </div>
  );
}

export default Range;