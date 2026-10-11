import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import FormField from '../components/FormField';
import { createUser } from '../api/userApi';
import { applyServerErrors } from '../hooks/useServerFieldErrors';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../validation/userSchemas';
import { formatCpf } from '../utils/formatters';
import usePageTitle from '../hooks/usePageTitle';

export default function RegisterPage() {
  usePageTitle('Criar conta');
  const [formAlert, setFormAlert] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/minha-conta';

  const {
    register, handleSubmit, setError, setValue, formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', cpf: '', password: '', confirmPassword: '', acceptedTerms: false },
    mode: 'onTouched',
  });

  const onSubmit = async (formValues) => {
    setFormAlert(null);
    try {
      const response = await createUser(formValues);
      signIn(response.data);
      toast.success('Conta criada! Suas compras chegam neste e-mail.');
      navigate(redirectPath);
    } catch (requestError) {
      const generalMessage = applyServerErrors(requestError, setError);
      if (generalMessage) setFormAlert(generalMessage);
    }
  };

  const cpfRegistration = register('cpf');

  return (
    <div className="container page">
      <div className="auth-wrap">
        <h1 className="page-title">Criar conta</h1>
        <p className="auth-subtitle">Seus conteúdos chegam no e-mail cadastrado.</p>

        <form className="panel" onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="required-note">
          <p id="required-note" className="field-hint" style={{ marginTop: 0, marginBottom: 14 }}>
            Campos com <span className="required-mark">*</span> são obrigatórios.
          </p>
          {formAlert && <div className="form-alert" role="alert">{formAlert}</div>}

          <FormField id="name" label="Nome completo" required autoComplete="name" error={errors.name?.message} {...register('name')} />
          <FormField
            id="email" label="E-mail (usado para entrega)" type="email" required autoComplete="email"
            hint="É aqui que você recebe as compras." error={errors.email?.message} {...register('email')}
          />
          <FormField
            id="cpf" label="CPF" required inputMode="numeric" autoComplete="off" placeholder="000.000.000-00"
            error={errors.cpf?.message}
            {...cpfRegistration}
            onChange={(event) => {
              setValue('cpf', formatCpf(event.target.value), { shouldValidate: Boolean(errors.cpf) });
            }}
          />
          <div className="two-columns">
            <FormField
              id="password" label="Senha" type="password" required autoComplete="new-password"
              hint="Mínimo 8 caracteres, com letra e número." error={errors.password?.message} {...register('password')}
            />
            <FormField
              id="confirmPassword" label="Confirmar senha" type="password" required autoComplete="new-password"
              error={errors.confirmPassword?.message} {...register('confirmPassword')}
            />
          </div>

          <div className="field">
            <label className="check-row" htmlFor="acceptedTerms" style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'inherit', fontSize: 14 }}>
              <input
                id="acceptedTerms" type="checkbox"
                aria-invalid={errors.acceptedTerms ? 'true' : 'false'}
                aria-describedby={errors.acceptedTerms ? 'acceptedTerms-error' : undefined}
                {...register('acceptedTerms')}
              />
              <span>Aceito os termos de uso e a política de privacidade.<span className="required-mark" aria-hidden="true">*</span></span>
            </label>
            {errors.acceptedTerms && (
              <p id="acceptedTerms-error" className="field-error" role="alert">{errors.acceptedTerms.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">Já tem conta? <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`}>Entrar</Link></p>
      </div>
    </div>
  );
}
