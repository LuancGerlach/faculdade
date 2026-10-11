import { forwardRef } from 'react';

// Campo reutilizável: label associado, dica, erro anunciado e aria-invalid
const FormField = forwardRef(function FormField(
  { id, label, error, hint, required = false, type = 'text', ...inputProps },
  inputRef,
) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="required-mark" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        ref={inputRef}
        type={type}
        className="input"
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
      {hint && !error && <p id={hintId} className="field-hint">{hint}</p>}
    </div>
  );
});

export default FormField;
