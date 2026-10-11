import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import FormField from '../FormField';
import { updateUser } from '../../api/userApi';
import { getErrorStatus } from '../../api/errorHandler';
import { applyServerErrors } from '../../hooks/useServerFieldErrors';
import { accountSchema } from '../../validation/userSchemas';

export default function AccountDataPanel({ currentUser, onUserUpdated, onUserNotFound }) {
  const [formAlert, setFormAlert] = useState(null);
  const {
    register, handleSubmit, setError, reset, formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: currentUser.name, email: currentUser.email },
    mode: 'onTouched',
  });

  const onSubmit = async (formValues) => {
    setFormAlert(null);
    try {
      const response = await updateUser(currentUser.id, formValues);
      onUserUpdated(response.data);
      reset({ name: response.data.name, email: response.data.email });
      toast.success('Dados atualizados');
    } catch (requestError) {
      if (getErrorStatus(requestError) === 404) {
        onUserNotFound();
        return;
      }
      const generalMessage = applyServerErrors(requestError, setError);
      if (generalMessage) setFormAlert(generalMessage);
    }
  };

  return (
    <>
      <h2 className="page-title">Dados da conta</h2>
      <form className="panel" onSubmit={handleSubmit(onSubmit)} noValidate style={{ maxWidth: 520 }}>
        {formAlert && <div className="form-alert" role="alert">{formAlert}</div>}
        <FormField id="account-name" label="Nome completo" required autoComplete="name" error={errors.name?.message} {...register('name')} />
        <FormField
          id="account-email" label="E-mail de entrega" type="email" required autoComplete="email"
          hint="Novas compras e reenvios vão para este e-mail." error={errors.email?.message} {...register('email')}
        />
        <FormField id="account-cpf" label="CPF" value={currentUser.cpf} readOnly hint="O CPF não pode ser alterado." />
        <button type="submit" className="btn" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </>
  );
}
