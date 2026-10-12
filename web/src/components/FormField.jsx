// Campo reutilizável: label associado, dica, erro anunciado e aria-invalid
export default function FormField({ id, label, error, hint, required = false, type = 'text', ...inputProps }) {
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
}
