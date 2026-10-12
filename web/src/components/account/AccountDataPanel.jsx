import { useState } from 'react';
import FormField from '../FormField';
import { toast } from '../Toast';
import { updateUser } from '../../api/userApi';
import { applyServerErrors, getErrorStatus } from '../../api/errorHandler';
import { useForm } from '../../hooks/useForm';
import { validateAccount } from '../../validation/userValidation';

export default function AccountDataPanel({ currentUser, onUserUpdated, onUserNotFound }) {
  const [formAlert, setFormAlert] = useState(null);

  const { isSubmitting, isDirty, fieldProps, handleSubmit } = useForm({
    initialValues: { name: currentUser.name, email: currentUser.email },
    validate: validateAccount,
    onSubmit: async (formValues, { setFieldErrors }) => {
      setFormAlert(null);
      try {
        const updatedUser = await updateUser(currentUser.id, formValues);
        onUserUpdated(updatedUser);
        toast.success('Dados atualizados');
      } catch (requestError) {
        if (getErrorStatus(requestError) === 404) {
          onUserNotFound();
          return;
        }
        setFormAlert(applyServerErrors(requestError, setFieldErrors));
      }
    },
  });

  return (
    <>
      <h2 className="page-title">Dados da conta</h2>
      <form className="panel" onSubmit={handleSubmit} noValidate style={{ maxWidth: 520 }}>
        {formAlert && <div className="form-alert" role="alert">{formAlert}</div>}
        <FormField id="account-name" label="Nome completo" required autoComplete="name" {...fieldProps('name')} />
        <FormField
          id="account-email" label="E-mail de entrega" type="email" required autoComplete="email"
          hint="Novas compras e reenvios vão para este e-mail." {...fieldProps('email')}
        />
        <FormField id="account-cpf" label="CPF" value={currentUser.cpf} readOnly hint="O CPF não pode ser alterado." />
        <button type="submit" className="btn" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </>
  );
}
