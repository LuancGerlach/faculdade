import { useState } from 'react';

// Hook de formulário: estado dos campos, validação ao sair do campo e no envio
export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([fieldName]) => touchedFields[fieldName]),
  );

  const setFieldValue = (fieldName, fieldValue) => {
    const nextValues = { ...values, [fieldName]: fieldValue };
    setValues(nextValues);
    if (touchedFields[fieldName]) setErrors(validate(nextValues));
  };

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFieldValue(name, type === 'checkbox' ? checked : value);
  };

  const handleBlur = (event) => {
    setTouchedFields((currentTouched) => ({ ...currentTouched, [event.target.name]: true }));
    setErrors(validate(values));
  };

  // Erros vindos da API (400/409) aparecem no campo correspondente
  const setFieldErrors = (fieldErrors) => {
    setErrors((currentErrors) => ({ ...currentErrors, ...fieldErrors }));
    setTouchedFields((currentTouched) => ({
      ...currentTouched,
      ...Object.fromEntries(Object.keys(fieldErrors).map((fieldName) => [fieldName, true])),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouchedFields(Object.fromEntries(Object.keys(values).map((fieldName) => [fieldName, true])));

    const invalidFieldNames = Object.keys(validationErrors);
    if (invalidFieldNames.length) {
      event.target.querySelector(`[name="${invalidFieldNames[0]}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values, { setFieldErrors });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = Object.keys(initialValues).some((fieldName) => initialValues[fieldName] !== values[fieldName]);

  // Props prontas para ligar um input ao formulário
  const fieldProps = (fieldName) => ({
    name: fieldName,
    value: values[fieldName],
    onChange: handleChange,
    onBlur: handleBlur,
    error: visibleErrors[fieldName],
  });

  return { values, errors: visibleErrors, isSubmitting, isDirty, fieldProps, setFieldValue, setFieldErrors, handleSubmit, setValues };
}
