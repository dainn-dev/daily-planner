import React from 'react';

const FormTextarea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 4,
  maxLength,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-zinc-900" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className={`w-full bg-white border ${
          error ? 'border-red-500' : 'border-border-light'
        } rounded-lg px-3 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-200' : 'focus:ring-zinc-900'
        } focus:border-transparent transition-all resize-none placeholder-zinc-400 ${className}`}
        id={id}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {maxLength && (
        <p className="text-xs text-secondary text-right">
          {value.length}/{maxLength} ký tự
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;

