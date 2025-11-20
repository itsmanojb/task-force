import React from "react";

interface CheckboxProps {
  id: string; // required so label links to input
  checked?: boolean; // controlled or uncontrolled
  onChange?: (checked: boolean) => void;
  label?: string; // optional label text
  style?: React.CSSProperties; // for overriding CSS vars per instance
}

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  style = {},
}: CheckboxProps) {
  return (
    <div className="chk-wrapper" style={style}>
      <input
        id={id}
        type="checkbox"
        className="chk-input"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />

      <label
        htmlFor={id}
        className="chk-label"
        aria-hidden={label ? "false" : "true"}
      >
        <svg viewBox="0 0 24 24" className="chk-svg">
          <path
            className="chk-path"
            d="M4 12l4 4L20 6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </label>

      {label && <span className="chk-text">{label}</span>}
    </div>
  );
}
