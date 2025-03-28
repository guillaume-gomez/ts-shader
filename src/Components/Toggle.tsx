
interface ToggleProps {
  label: string;
  onToggle: (newValue: boolean) => void;
  value: boolean
}

function Toggle({label, onToggle, value}) {
  return (
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">{label}</span>
          <input type="checkbox" className="toggle toggle-primary" checked={value} onChange={() => onToggle(!value)} />
        </label>
      </div>
  )
}

export default Toggle;